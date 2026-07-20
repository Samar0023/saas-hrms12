import mongoose from 'mongoose'

 const connectdb = async (): Promise <void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string);

        console.log(`MongoDB Live ${conn.connection.host}`);
    }
    catch(error : any){
    console.error("MOngoDB connection Failed" , error);
    process.exit(-1);
    }
}

export default connectdb;