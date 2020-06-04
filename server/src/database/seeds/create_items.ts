import Knex from 'knex';

export async function seed(knex: Knex) {
    await knex('items').insert([
        { 
            title: 'Lamps',
            image: 'lamps.svg',
        },
        { 
            title: 'Bateries',
            image: 'bateries.svg',
        },
        { 
            title: 'Paper and Cardboards',
            image: 'paper.svg',
        },
        { 
            title: 'Electronic Waste',
            image: 'electronic.svg',
        },
        { 
            title: 'Organic Waste',
            image: 'organic.svg',
        },
        { 
            title: 'Kitchen Oil',
            image: 'oil.svg',
        },
    ])
}