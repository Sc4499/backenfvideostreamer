import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
        });

        const uploadFileOnCloud = async(filepath)=>{
            try {
                if(!filepath) return null;
                const uploadResult = await cloudinary.uploader
                .upload(
                    'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
                        public_id: 'shoes',
                        resource_type:auto
                    }
               
                )
                console.log(uploadResult);
                return uploadResult
             } catch (error) {
                fs.unlinkSync(filepath)
                console.log("something went wrong" + error)
            }
           
        } 

       
})();