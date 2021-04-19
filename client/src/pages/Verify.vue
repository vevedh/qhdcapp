<template>
  <div class="row justify-center items-center content-center">
    <div v-if="success" class="col-md-8 q-pa-lg text-center">
      Merci de nous faire confiance votre compte est vérifié.
    </div>
    <div v-else class="col-md-8 q-pa-lg text-center">
      Vérification du compte...veuillez patientez...
    </div>
  </div>
</template>
<script>

import { Notify } from "quasar";
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      success: false
    };
  },
  computed:{
    ...mapGetters('auth', ['isAuthenticated', 'user']),
  },
  mounted() {
    this.verifyAccount();
  },
  methods: {
    ...mapActions('authManagement', { checkAccount:'create'}),
    async verifyAccount() {
      let token = this.$route.query.token;
      let result;
      if (token) {
        result = await this.checkAccount([{ action:'verifySignupLong', value:token }]).catch(err => {
          console.log("Erreur :",err)
          if (err.response) {
            let code = err.response.data.code;
            Notify.create({
              message: `Impossible de verifier le compte. Contactez le support <veveddh@gmail.com>.`,
              color: "negative"
            });
          }
        });
      }
      if (result && result.status === 201) {
        this.success = true;
        this.$router.push("/login");
      } else {
        this.$router.push("/");
      }
    }
  }
};
</script>
