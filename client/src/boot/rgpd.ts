import { Cookies, Notify, openURL } from 'quasar'

if (Cookies.has('rgpd') !== true) {
  Notify.create({
    message: `Notre site utilise des cookies, qui sont nécessaires à son fonctionnement et nécessaires pour atteindre les objectifs illustrés dans la politique de cookies.`,
    multiLine:true,
    classes: 'doc-rgpd',
    timeout: 0,
    position: 'bottom-right',
    actions: [
      {
        label: 'Acceptez',
        color: 'yellow',
        handler () {
          Cookies.set('rgpd', 'true',{ sameSite:'None'})
        }
      },
      {
        label: 'Plus d\'infos',
        color: 'grey',
        noDismiss: true,
        handler () {
          openURL('https://linc.cnil.fr/fr/une-petite-histoire-du-cookie')
        }
      }
    ]
  })
}
