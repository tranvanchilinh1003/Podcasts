export interface ICustomer{
    id?:string;
    username: string,
    full_name: string,
    password: string,
    email: string,
    role?: string,
    gender?: string,
    images?: string,
    isticket?: string,
    background?: string,
}
interface Window {
    webkitSpeechRecognition: any;
  }
