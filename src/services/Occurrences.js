const { DateTime } = require('luxon');

const { AnepcApi } = require('../api');
const { db, Op } = require('../database/models');
const { sendMessageToChannel }  = require('./Discord');
const { channels } = require('../../config/discord');

DateTime.local().setLocale("pt");

const timeFormat = 'dd/LL T';

const getOccurrences = async (client) => {
    try {
        const result = await AnepcApi.getAllOccurrences();

        const strOccurrences = await Promise.all(result.map(async occurrence => {
            const occurInDb = await db.Occurrences.findByPk(occurrence.id).then(result => result);

            if (occurInDb === null) {
                const generateNew = () => {
                    const time = DateTime.fromMillis(occurrence.time).toFormat(timeFormat);

                    const strOccHeader = `${occurrence.id} - ${time} | ${occurrence.nature} | ${occurrence.parish}, ${occurrence.town}`;

                    const strValues = `Estado: ${occurrence.status} | :man_firefighter: ${occurrence.operatives} | :fire_engine: ${occurrence.ground} | :helicopter: ${occurrence.aerial}`;

                    const strCoordinates = `Coordenadas: ${occurrence.latitude}, ${occurrence.longitude} | GMaps: <http://maps.google.com/maps?q=loc:${occurrence.latitude},${occurrence.longitude}>`;

                    return `${strOccHeader}\n${strValues}\n${strCoordinates}`;
                }
                
                db.Occurrences.upsert(occurrence);
                
                return {
                    newOccurrence: true,
                    updOccurrence: false,
                    message: generateNew()
                }

            } else {
                let updatedValues = false;

                const compareStatus = ((oldStatus, newStatus) => {
                    if (oldStatus === newStatus) {
                        return `${newStatus} (=)`;
                    }

                    updatedValues = true;
                
                    return `${oldStatus} :arrow_right: ${newStatus}`;
                });
                
                const compareValues = ((oldValue, newValue) => {
                    if (oldValue == newValue) {
                        return `${newValue} (=)`;
                    }

                    updatedValues = true;
                
                    if (oldValue < newValue) {
                        return `${newValue} :arrow_up: (+${newValue-oldValue})`;
                    }
                
                    return `${newValue} :arrow_down: (${newValue-oldValue})`;
                });

                const strStatus = compareStatus(occurInDb.status, occurrence.status);

                const strOperatives = compareValues(occurInDb.operatives, occurrence.operatives);

                const strGround = compareValues(occurInDb.ground, occurrence.ground);

                const strAerial = compareValues(occurInDb.aerial, occurrence.aerial);

                if (!updatedValues) {
                    return {
                        newOccurrence: false,
                        updOccurrence: false,
                    }
                }

                const time = DateTime.fromMillis(occurrence.time).toFormat(timeFormat);
                
                const strOccHeader = `${occurrence.id} - ${time} | ${occurrence.nature} | ${occurrence.parish}, ${occurrence.town}`;

                const strValues = `Estado: ${strStatus} | :man_firefighter: ${strOperatives} | :fire_engine: ${strGround} | :helicopter: ${strAerial}`;

                const strCoordinates = `Coordenadas: ${occurrence.latitude}, ${occurrence.longitude} | GMaps: <http://maps.google.com/maps?q=loc:${occurrence.latitude},${occurrence.longitude}>`;

                const strChange = `${strOccHeader}\n${strValues}\n${strCoordinates}`;

                db.Occurrences.upsert(occurrence);

                return {
                    newOccurrence: false,
                    updOccurrence: true,
                    message: strChange
                }
            }
        }));

        const newOccurrences = strOccurrences.filter((occ) => occ.newOccurrence).map((occ) => occ.message);

        const updOccurrences = strOccurrences.filter((occ) => occ.updOccurrence).map((occ) => occ.message);

        const channel = client.channels.cache.get(channels.OCCURRENCES_CHANNEL_ID);

        if (newOccurrences.length > 0) {
            const strNew = `***Novas ocorrências:***\n${newOccurrences.join('\n\n')}`;
            
            sendMessageToChannel(channel, strNew);
        }

        if (updOccurrences.length > 0) {
            const strUpd = `***Ocorrências atualizadas:***\n${updOccurrences.join('\n\n')}`;

            sendMessageToChannel(channel, strUpd);
        }

    } catch (e){
        console.log(`Error!\n${e}`);
        return;
    }; 
};

const clearDb = async () => {
    const dateLimit = DateTime.local().minus({ days: 7 }).toISODate();

    db.Occurrences.destroy({
        where: {
          time: {
            [Op.lte]: dateLimit,
          },
        },
      });
};

module.exports = {
    getOccurrences,
    clearDb,
};
