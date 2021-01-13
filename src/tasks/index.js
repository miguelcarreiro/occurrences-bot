const schedule = require('node-schedule');

const { Occurrences } = require('../services');

class Tasks {
    constructor(client) {
      this.client = client;
    }

    startTasks(){
        this.getOccurrences();
        this.clearDb();
    }

    getOccurrences(){
        const rule = new schedule.RecurrenceRule();

        rule.minute = new schedule.Range(0, 59, 5);

        schedule.scheduleJob(rule, () => Occurrences.getOccurrences(this.client));
    }

    clearDb(){
        const rule = new schedule.RecurrenceRule();

        rule.dayOfWeek = 0;

        schedule.scheduleJob(rule, () => Occurrences.clearDb());
    }
}

module.exports = Tasks;
