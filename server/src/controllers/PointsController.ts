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

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://localhost:3333/uploads/OrgImages/${point.image}`
            };
        });

        return response.json(serializedPoints);

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

        const serializedPoint = {
            ...point,
            image_url: `http://localhost:3333/uploads/OrgImages/${point.image}`,
            items,
        };

        return response.json(serializedPoint);
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
            image: request.file.filename,
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
    
        const point_items = items
            .split(',')
            .map((item: string) => Number(item))
            .map((item_id: number) => {
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