 import {z} from "zod"

export const signSchema = z.object({ 
         username:z
         .string()
         .trim()
         .min(3, "Username Length should be Greater than 3")
         .max(30 , "Username Length should be Less than 30"),
         password:z
         .string()
         .min(8, "Username Length should be Greater than 3"),
         email:z
         .email("Invalid Email Address")
         .trim()
         .toLowerCase(),
          designation:z
          .string()
          .min(2 , "Designation is required"),

          role:z.enum(["Admin" , "HR" , "Employ"]),

          department:z
          .string()
          .min(2, "Department is Required"),

          isActive:z.boolean().optional().default(true)


});

export type RegisterBody = z.infer<typeof signSchema>;