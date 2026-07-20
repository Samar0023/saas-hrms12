import {z} from "zod"

export const leavesSchema = z.object({
    description:z
     .string()
     .min(25 , "Description should be greater than 25")
     .max(300 , "Description should be lesser than 300" ),
     leaveType:z.enum(["Casual" , "Maternity" , "Annual" , "Sick" , "Emergency"]),
      startDate:z.coerce.date(),
      endDate:z.coerce.date(),

})


export type RegisterBody = z.infer<typeof leavesSchema>