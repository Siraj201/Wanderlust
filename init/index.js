const mongoose=require("mongoose");
const initdata=require("./data.js");
const listing=require("../models/listing.js");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
main().then(res=>{
    console.log("connection successful");
}).catch(err=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(mongo_url);
}
// const initdb=async ()=>{
//  await listing.deleteMany({});
//  await listing.insertMany(initdata.data);
//  console.log("data was initialized"); 
// }
// initdb();

const initdb = async () => {
    await listing.deleteMany({});
    const modifiedData = initdata.data.map((obj) => ({
        ...obj,
        owner: '6741dc43fad5f7dbcbf98ec2',
    }));
    await listing.insertMany(modifiedData);
    console.log("Data was initialized");
};

initdb();