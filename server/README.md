<h1 align="center">
  API Server
</h1>

## Getting started...
First, let's clone the repository and install all of the project's dependencies:

    $ git clone https://github.com/andre-silva-14/ecoleta.git
    $ cd ecoleta/server
    $ npm install

Next, we will initialize and seed the server's database:

    $ npm run knex:migrate
    $ npm run knex:seed

And lastly run the server:

    $ npm run dev

Done, the API Server is now completly ready and listening on [http://localhost:3333/](http://localhost:3333/).

# API Requests

## Creating a new Collection Point: 

Request Method : `POST`

Request URL : `http://localhost:3333/points`

This request will create a Point in the server's database with the provided data.
Expects to receive a MultiPart Form with all of the necessary fields for point creation, which include:

```
{
	name: string;
	email: string;
	whatsapp: string;
	latitude: number;
	longitude: number;
	apartmentNumber: string;
	city: string;
	countryCode: string[2];
	items: string (i.e. "1,2,6");
	image: Image Type File;
}
```

Note: Whatsapp and apartmentNumber were declared as strings to support formats like "+63 999 999 999" and "36B".

###### Response

If the server successfully received the data and created the point you will receive a response with the created point_id, otherwise you will receive an object with the status code and error message.

## List Collection Items:

Request Method : `GET`

Request URL : `http://localhost:3333/items`

###### Response

You will receive a list of Item objects, each one with the following structure:

```
{
    id: number;
    title: string;
    image_url: string;
}
```

## List Filtered Points:

Request Method: `GET`

Request URL: `http://localhost:3333/points`

Example:

`http://localhost:3333/points?city=Lower%20Silesian%20Voivodeship&countryCode=PL&items=2,3`

###### Response

An array with all Points which meet the filter conditions.


## Show Collection Point Detail:

Request Method: `GET`

Request URL: `http://localhost:3333/points/{point_id}`

Example:

`http://localhost:3333/points/2`

###### Response

```
{
  id: number;
  image: string;
  image_url: string;
  name: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  apartmentNumber: string;
  city: string;
  countryCode: string;
  items: [
    {
      title: string;
    }
  ]
}
```