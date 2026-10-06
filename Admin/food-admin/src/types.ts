export type Category={id:string;name:string};
export type Item={id:string;name:string;description:string;price:number;categoryId:string;imageUrl:string;stock:number;available:boolean};
export type OrderStatus='PENDING'|'CONFIRMED'|'PREPARING'|'OUT_FOR_DELIVERY'|'DELIVERED'|'CANCELLED';
export type Order={id:string;orderNumber:string;customerName:string;phone:string;address:string;paymentMethod:'PAYHERE'|'WHATSAPP';paymentStatus:'PENDING'|'PAID'|'FAILED';status:OrderStatus;total:number;createdAt:string;items:{name:string;qty:number;price:number}[]};
export const STATUSES:OrderStatus[]=['PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED'];
// Allowed status transitions
export const NEXT:Record<OrderStatus,OrderStatus[]>={PENDING:['CONFIRMED','CANCELLED'],CONFIRMED:['PREPARING','CANCELLED'],PREPARING:['OUT_FOR_DELIVERY','CANCELLED'],OUT_FOR_DELIVERY:['DELIVERED'],DELIVERED:[],CANCELLED:[]};
