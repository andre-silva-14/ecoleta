import knex from '../database/connection';
import { Request, Response } from 'express';

class ItemsController {
    async index(request: Request, response: Response) {
        const items = await knex('items').select('*');
        const host = request.headers.host;
        const xRequestProtocol = request.headers["x-forwarded-proto"] ? "https" : "http";
    
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `${xRequestProtocol}://${host}/uploads/${item.image}`
            };
        });
    
        return response.json(serializedItems);
    }
}

export default ItemsController;