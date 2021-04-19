module.exports = function(app) {

  function getLink(type, hash) {
    const url = `http://${app.get('host')}:8080/` + type + '?token=' + hash
    return url
  }

  function sendEmail(email) {
    return app.service('mailer').create(email).then(function (result) {
      console.log('Sent email', result)
    }).catch(err => {
      console.log('Error sending email', err)
    })
  }

  return {
    notifier: function(type, user, notifierOptions) {
      let tokenLink
      let email
      switch (type) {
        case 'resendVerifySignup': //sending the user the verification email
          tokenLink = getLink('verify', user.verifyToken)
          email = {
             from: app.get('smtp_from'),
             to: user.email,
             subject: 'HDCApp: Vérification d\'inscription',
             html: `Bonjour,<br>
             Merci de nous faire confiance, cliquez sur le lien ci-dessous pour confirmer votre adresse e-mail<br>
             ${tokenLink}<br>
             Si cela ne fonctionne pas vous pouvez recopier le lien et le coller dans la barre d'adresse de votre navigateur<br>
             `
          }
          return sendEmail(email)
          break

        case 'verifySignup': // confirming verification
          tokenLink = getLink('verify', user.verifyToken)
          email = {
             from: app.get('smtp_from'),
             to: user.email,
             subject: 'HDCApp: Confirmation d\'inscription',
             html: 'Merci de votre confiance et à bientôt :-)'
          }
          return sendEmail(email)
          break

        case 'sendResetPwd':
          tokenLink = getLink('reset', user.resetToken)
          email = {}
          return sendEmail(email)
          break

        case 'resetPwd':
          tokenLink = getLink('reset', user.resetToken)
          email = {}
          return sendEmail(email)
          break

        case 'passwordChange':
          email = {}
          return sendEmail(email)
          break

        case 'identityChange':
          tokenLink = getLink('verifyChanges', user.verifyToken)
          email = {}
          return sendEmail(email)
          break

        default:
          break
      }
    }
  }
}
