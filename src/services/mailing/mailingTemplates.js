import CONFIG from "../../config/config.js";

export function passwordRecoveryTemplate(baseURL, token) {
	const template = {
		from: CONFIG.mailing.USER,
		subject: "Password recovery",
		html: `<div>Si recibe esto es porque usted u otra persona ha solicitado 
		el reestablecimiento de su contraseña.</div>
    	<div>Para proceder con el proceso, continúe por el siguiente link: </div>
    	<div>${baseURL}/reset/${token}</div>`,
	};
	return template;
}

export function deletedAccount() {
	const template = {
		from: CONFIG.mailing.USER,
		subject: "Deleted account",
		html: `<div>Si recibe este mail es porque su cuenta se ha eliminado 
		por inactividad. Por favor vuelva a registrarse si desea continuar 
		utilizando nuestros servicios.</div>`,
	};
	return template;
}

export function deletedProduct(productName) {
	const template = {
		from: CONFIG.mailing.USER,
		subject: "Deleted product",
		html: `<div>Si recibe este mail es porque su producto ${productName}  
		ha sido eliminado. En caso de que esto sea un error comuníquese con nosotros.
		</div>`,
	};
	return template;
}
