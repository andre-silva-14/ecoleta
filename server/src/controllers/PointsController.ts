import knex from '../database/connection';
import { Request, Response } from 'express';

class PointsController {
    async index (request: Request, response: Response) {
        const { city, countryCode, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('countryCode', String(countryCode))
            .distinct()
            .select('points.*')

        return response.json(points);

    }

    async show (request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point){
            return response.status(404).json({ message: 'Point Not Found.'})
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        return response.json({ point, items });
    }

    async create (request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            apartmentNumber,
            city,
            countryCode,
            items
        } = request.body;
    
        const trx = await knex.transaction();

        const point = {
            image: 'https://images.unsplash.com/photo-1576425177711-310534754b35?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            apartmentNumber,
            city,
            countryCode
        };
    
        const insertedId = await trx('points').insert(point);
    
        const point_id = insertedId[0];
    
        const point_items = items.map((item_id: number) => {
            return {
                item_id,
                point_id,
            }
        });
    
        await trx('point_items').insert(point_items);
    
        await trx.commit();
    
        return response.json({
            point_id,
            ...point,
            items,
        });
    }
}


export default PointsController;