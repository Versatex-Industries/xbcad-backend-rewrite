const mongoose = require('mongoose');
const BusRoute = require('./src/schemas/BusRoute');

async function seedBusRoutes() {
    await mongoose.connect('mongodb://127.0.0.1:27017/xbcadbackend');

    const routes = [
        {
            routeName: "Route 1",
            stops: [
                { stopName: "Stop 1", location: { coordinates: [28.0473, -26.2041] } },
                { stopName: "Stop 2", location: { coordinates: [28.0508, -26.1951] } },
                { stopName: "Stop 3", location: { coordinates: [28.0567, -26.1886] } },
                { stopName: "Stop 4", location: { coordinates: [28.0600, -26.1803] } }
            ],
            liveLocation: { coordinates: [28.0473, -26.2041] },
            scheduleId: new mongoose.Types.ObjectId(),
        },
        {
            routeName: "Route 2",
            stops: [
                { stopName: "Stop A", location: { coordinates: [28.0700, -26.1750] } },
                { stopName: "Stop B", location: { coordinates: [28.0734, -26.1675] } },
                { stopName: "Stop C", location: { coordinates: [28.0780, -26.1587] } },
                { stopName: "Stop D", location: { coordinates: [28.0830, -26.1502] } }
            ],
            liveLocation: { coordinates: [28.0700, -26.1750] },
            scheduleId: new mongoose.Types.ObjectId(),
        },
        {
            routeName: "Route 3",
            stops: [
                { stopName: "Stop Alpha", location: { coordinates: [28.0890, -26.1340] } },
                { stopName: "Stop Beta", location: { coordinates: [28.0950, -26.1250] } },
                { stopName: "Stop Gamma", location: { coordinates: [28.1000, -26.1200] } },
                { stopName: "Stop Delta", location: { coordinates: [28.1050, -26.1150] } }
            ],
            liveLocation: { coordinates: [28.0890, -26.1340] },
            scheduleId: new mongoose.Types.ObjectId(),
        },
        {
            routeName: "Route 4",
            stops: [
                { stopName: "Stop X", location: { coordinates: [28.1100, -26.1100] } },
                { stopName: "Stop Y", location: { coordinates: [28.1150, -26.1000] } },
                { stopName: "Stop Z", location: { coordinates: [28.1200, -26.0900] } },
                { stopName: "Stop W", location: { coordinates: [28.1250, -26.0800] } }
            ],
            liveLocation: { coordinates: [28.1100, -26.1100] },
            scheduleId: new mongoose.Types.ObjectId(),
        },
        {
            routeName: "Route 5",
            stops: [
                { stopName: "Stop One", location: { coordinates: [28.1300, -26.0700] } },
                { stopName: "Stop Two", location: { coordinates: [28.1350, -26.0650] } },
                { stopName: "Stop Three", location: { coordinates: [28.1400, -26.0600] } },
                { stopName: "Stop Four", location: { coordinates: [28.1450, -26.0550] } }
            ],
            liveLocation: { coordinates: [28.1300, -26.0700] },
            scheduleId: new mongoose.Types.ObjectId(),
        },
        {
            routeName: "Route 6",
            stops: [
                { stopName: "Stop 11", location: { coordinates: [28.1500, -26.0500] } },
                { stopName: "Stop 12", location: { coordinates: [28.1550, -26.0450] } },
                { stopName: "Stop 13", location: { coordinates: [28.1600, -26.0400] } },
                { stopName: "Stop 14", location: { coordinates: [28.1650, -26.0350] } }
            ],
            liveLocation: { coordinates: [28.1500, -26.0500] },
            scheduleId: new mongoose.Types.ObjectId(),
        },
        {
            routeName: "Route 7",
            stops: [
                { stopName: "Central", location: { coordinates: [28.1700, -26.0300] } },
                { stopName: "East", location: { coordinates: [28.1750, -26.0250] } },
                { stopName: "West", location: { coordinates: [28.1800, -26.0200] } },
                { stopName: "North", location: { coordinates: [28.1850, -26.0150] } }
            ],
            liveLocation: { coordinates: [28.1700, -26.0300] },
            scheduleId: new mongoose.Types.ObjectId(),
        },
        {
            routeName: "Route 8",
            stops: [
                { stopName: "Park 1", location: { coordinates: [28.1900, -26.0100] } },
                { stopName: "Park 2", location: { coordinates: [28.1950, -26.0050] } },
                { stopName: "Park 3", location: { coordinates: [28.2000, -26.0000] } },
                { stopName: "Park 4", location: { coordinates: [28.2050, -25.9950] } }
            ],
            liveLocation: { coordinates: [28.1900, -26.0100] },
            scheduleId: new mongoose.Types.ObjectId(),
        },
        {
            routeName: "Route 9",
            stops: [
                { stopName: "Suburb A", location: { coordinates: [28.2100, -25.9900] } },
                { stopName: "Suburb B", location: { coordinates: [28.2150, -25.9850] } },
                { stopName: "Suburb C", location: { coordinates: [28.2200, -25.9800] } },
                { stopName: "Suburb D", location: { coordinates: [28.2250, -25.9750] } }
            ],
            liveLocation: { coordinates: [28.2100, -25.9900] },
            scheduleId: new mongoose.Types.ObjectId(),
        },
        {
            routeName: "Route 10",
            stops: [
                { stopName: "Urban A", location: { coordinates: [28.2300, -25.9700] } },
                { stopName: "Urban B", location: { coordinates: [28.2350, -25.9650] } },
                { stopName: "Urban C", location: { coordinates: [28.2400, -25.9600] } },
                { stopName: "Urban D", location: { coordinates: [28.2450, -25.9550] } }
            ],
            liveLocation: { coordinates: [28.2300, -25.9700] },
            scheduleId: new mongoose.Types.ObjectId(),
        }
    ];

    await BusRoute.insertMany(routes);
    console.log('Bus routes seeded successfully');
    mongoose.connection.close();
}

seedBusRoutes();
