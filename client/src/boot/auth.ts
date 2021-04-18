import { LocalStorage, Notify } from "quasar";
import { boot } from "quasar/wrappers";
import axios from 'axios';

export default  boot(async ({ router , store }  ) => {
  router.beforeEach(async (to, from, next) => {

    //let apiUrl = (await axios.get(window.location.origin+'/qc-adm/cacem.config.json')).data.apiUrl

    console.log('to :',to)
    console.log('Store :',store.state)

    if (to.meta.requiresAuth) {
      // if requires admin
      if (store.state.auth.user) {
        if (to.meta.requiresAdmin) {
          if (
            store.state.auth.user.permissions &&
            store.state.auth.user.permissions.includes("admin")
          ) {
            next();
          } else {
            Notify.create({
              message: `Vous n'avez pas accès à cette page, contactez l\'administrateur.`,
              color: "negative"
            });
            next("/account");
          }
        } else if (
          to.path === "/" ||
          to.path === "/login" ||
          to.path === "/register"
        ) {
          next("/account");
        } else if (!LocalStorage.getItem("feathers-jwt") && to.path !== "/") {
          next("/login");
        } else {
          next();
        }
      } else {
        if (to.path !== "/login") {
          next("/login");
        } else {
          next();
        }
      }

    } else {
      next();
    }
    //next();
  });
});
