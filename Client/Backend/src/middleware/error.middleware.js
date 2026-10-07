import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function errorMiddleware(error, req, res, next) {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
    });
  }

  if(error instanceof Prisma.PrismaClientInitializationError){
    if(error.code == "P2025"){
      return res.status(404).json({
        success: false,
        message: "Resource not found"
      })
    }
    if(error.code == "P2002"){
      return res.status(409).json({
        success: false,
        message: "Unique constraint failed"
      })
    }
    if(error.code == "P2003"){
      return res.status(400).json({
        success: false,
        message: "Invalid related resource"
      })
    }
  }
  if(error.message){
    return res.status(400).json({
      success:false,
      message: error.message
    })
  }
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}