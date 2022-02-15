const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')


main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/YelpCamp');
    console.log("Database Connected")
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 10) + 20;
        const camp = new Campground({
            author: '62087b049e647369b8bd356e',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis quis natus corporis nostrum soluta vitae corrupti, dolores recusandae velit reiciendis sint mollitia quidem ex facere molestiae voluptatum exercitationem, temporibus labore?',
            price,
            geometry:{
                type:"Point",
                coordinates:[ 
                    `${cities[random1000].longitude}`, 
                    `${cities[random1000].latitude}`
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/justimgcloudsand/image/upload/v1644808275/YelpCamp/ghxl6so73afrpco6jqqr.jpg',
                    filename: 'YelpCamp/ghxl6so73afrpco6jqqr',

                },
                {
                    url: 'https://res.cloudinary.com/justimgcloudsand/image/upload/v1644808271/YelpCamp/sh2bcffrjaqodypg357s.jpg',
                    filename: 'YelpCamp/sh2bcffrjaqodypg357s',

                },
                {
                    url: 'https://res.cloudinary.com/justimgcloudsand/image/upload/v1644808270/YelpCamp/e3ri62fsjmhsiztcgz4w.jpg',
                    filename: 'YelpCamp/e3ri62fsjmhsiztcgz4w',

                },
                {
                    url: 'https://res.cloudinary.com/justimgcloudsand/image/upload/v1644808268/YelpCamp/oxjbqvqds2jcfkwbvypf.jpg',
                    filename: 'YelpCamp/oxjbqvqds2jcfkwbvypf',

                }
            ],
        })
        await camp.save();
    }
}

seedDB().then(() => { mongoose.connection.close() })
