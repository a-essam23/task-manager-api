const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'bloxed77@gmail.com',
        subject:'Thanks for joining!',
        text: `Welcome to the app, ${name}!`

    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'bloxed77@gmail.com',
        subject:"We're sorry to see you gone.",
        text: `Goodbye, ${name}!`

    })
}
module.exports = {
    sendWelcomeEmail,sendCancelEmail

}