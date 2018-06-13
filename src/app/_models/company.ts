export class Company{
    id?: number;
    name: string;
    address?: string;
    postcode?: string;
    country: string;
    city: string;
    invoice_address?: string
    EIK?: string;
    VAT?: string;
    is_click?: boolean;
    paymentMethod?: string;
    comment?: string;
    created_at?: Date;
    updated_at?: Date;
}