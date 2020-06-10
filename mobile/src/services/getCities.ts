import axios from 'axios';

interface CCCityResponse {
    data: [
        {
            name: string;
        }
    ]
    links: [
        {
            rel: string;
            href: string;
        }
    ];
    metadata: {
        currentOffset: number;
        totalCount: number;
    };
};


async function getCitiesfromCC(selectedCC: string) {
    var cities: string[] = [];
    let totalCount = 0;
    let currentOffset = 0;
    const limit = 10;
    let counter = 10;
    let requestURL = `http://geodb-free-service.wirefreethought.com/v1/geo/countries/${selectedCC}/regions?offset=${currentOffset}&limit=${limit}`;

    await axios
        .get<CCCityResponse>(requestURL)
        .then(response => {
            cities.push(...response.data.data.map(CC => CC.name));
            totalCount = response.data.metadata.totalCount;
    });
    
    
    while (counter < totalCount) {
        currentOffset += 10;
        counter += 10;
        requestURL = `http://geodb-free-service.wirefreethought.com/v1/geo/countries/${selectedCC}/regions?offset=${currentOffset}&limit=${limit}`;
        let newCities: string[] = [];
        
        await axios.get<CCCityResponse>(requestURL).then(response => {
            newCities.push(...response.data.data.map(CC => CC.name));
        })
        cities.push(...newCities);
    };
    cities.sort();

    return cities;
}


export default getCitiesfromCC;