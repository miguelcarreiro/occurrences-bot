const axios = require('axios');

const { anepcUrl } = require('../../config/anepc');

const getAllOccurrences = async () => {
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-GB,en;q=0.9,pt-PT;q=0.8,pt;q=0.7,en-US;q=0.6',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json;charset=UTF-8',
        'Cookie': '_ga=GA1.2.170729661.1549020012; InfoSG=!DmYyBJwi5hg0i3ZbG6ntLvB9K03NirkTLa6lIVfVp5NrfgHfduO1XfUK4lKMBEWQhBRiLSboeMaT6g==; _gid=GA1.2.1365248646.1552260148; WSS_FullScreenMode=false; _gat=1',
        'Origin': 'http://www.prociv.pt',
        'Postman-Token': '0b638be1-5961-4d0a-9dda-2fc6d659fea7',
        'Referer': 'http://www.prociv.pt/en-us/SITUACAOOPERACIONAL/Pages/default.aspx?cID=15',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
        'cache-control': 'no-cache',
    };

    const data = {
        'distritoID': null,
        'concelhoID': null,
        'freguesiaID': null,
        'pageSize': 1000,
        'pageIndex': 1,
        'forToday': false,
        'natureza': null
    };

    const options = {
        method: 'POST',
        headers,
        data,
        url: anepcUrl,
    };

    const result = await axios(options).then(resp => {
        return resp.data["GetHistoryOccurrencesByLocationResult"]["arrayInfo"][0]["Data"]
        .filter((occurrence) => {
            return occurrence.Concelho.Name === 'SÃO PEDRO DO SUL';
        })       
        .map((occurrence) => {
            const time = parseInt(occurrence.DataOcorrencia.substring(6, 19));

            return {
                id: occurrence.Numero,
                time,
                family: occurrence.Natureza.FamiliaAbreviatura,
                category: occurrence.Natureza.EspecieAbreviatura,
                nature: occurrence.Natureza.NaturezaAbreviatura,
                status: occurrence.EstadoOcorrencia.Name,
                district: occurrence.Distrito.Name,
                municipality: occurrence.Concelho.Name,
                parish: occurrence.Freguesia.Name,
                town: occurrence.Localidade,
                latitude: occurrence.Latitude,
                longitude: occurrence.Longitude,
                operatives: occurrence.NumeroOperacionaisTerrestresEnvolvidos,
                ground: occurrence.NumeroMeiosTerrestresEnvolvidos,
                aerial: occurrence.NumeroMeiosAereosEnvolvidos,
                aerialOperatives: occurrence.NumeroOperacionaisAereosEnvolvidos
            };
        });
    });;

    return result;
}

module.exports = {
    getAllOccurrences,
};
