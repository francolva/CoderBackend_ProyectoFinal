import { Carts, Messages, Products, Tickets, Users } from "../daos/factory.js";
import MailingService from "../services/mailing/mailing.js";
import CartsRepository from "./carts.repository.js";
import MessageRepository from "./messages.repository.js";
import ProductsRepository from "./products.repository.js";
import TicketRepository from "./ticket.repository.js";
import UsersRepository from "./user.repository.js";

export const cartService = new CartsRepository(new Carts());
export const productService = new ProductsRepository(new Products());
export const userService = new UsersRepository(new Users());
export const ticketService = new TicketRepository(new Tickets());
export const messageService = new MessageRepository(new Messages());
export const mailingService = new MailingService();
