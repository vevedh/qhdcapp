<template>
  <q-page class="fit row justify-center bg-white q-py-xs">
    <!-- content -->

    <div class="column justify-center self-center q-pb-xs q-px-md" style="width: 400px">
      <div class="row justify-center self-center q-pb-none q-mb-none" style="width: 150px">
        <q-img :src="url" spinner-color="white" />
      </div>
      <div class="text-center q-pt-noe text-h5 q-pb-md ">
        Création d'un identifiant
      </div>
      <q-card class="my-card" bordered>
        <q-card-section
          style="width: 100%"
          class="text-center bg-green text-white text-h5 q-py-xs"
        >Inscription</q-card-section>
        <q-separator />
        <q-card-section class="q-pb-none">
          <q-form class="q-px-xl">
            <q-input
              filled
              bottom-slots
              v-model="email"
              label="*E-mail :"
              :dense="dense"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'E-mail obligatoire!']"
            ></q-input>
            <q-input
              filled
              bottom-slots
              type="password"
              v-model="password"
              label="Mot de passe :"
              :dense="dense"
            ></q-input>
          </q-form>
        </q-card-section>
        <q-card-actions class="row items-center justify-center q-pa-none">
          <div class="q-pb-xs">
            <q-btn
              color="primary"
              icon="lock"
              text-color="white"
              no-caps
              label="Inscription"
              @click="onRegister(email,password)"
              :disable="(email=='')&&(password=='')"
            />

          </div>
        </q-card-actions>
        <q-card-section
          class="col text-center"
          separator
        >Vous recevrez un mail de confirmation
        </q-card-section>
        <q-card-section class="row items-center justify-center q-pb-md q-pt-none">
          <div class="q-gutter-xl">
            <q-btn
              color="primary"
              icon="lock"
              text-color="white"
              no-caps
              label="Retour"
              to="/login"
            />

          </div>
        </q-card-section>
      </q-card>

    </div>
    <!-- <div class="q-pa-xs">
    <q-btn
              color="primary"
              text-color="white"
              label="S'inscrire..."
              no-caps
              to="/register"
            />
            </div>
            @click="onRegister(email,password)"
              :disable="(email=='')&&(password=='')"-->
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'RegisterPage',
  data() {
    return {
      email: '',
      password: '',
      url: 'logo_hdcapp.png',
      error: '',
      dense: true
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'user']),
    /*async checkIsAuthenticated() {
      console.log('Init');
      let auth = await this.$store.dispatch('auth/authenticate').catch(err => {
        console.log('Non authentifié!');
      });
      console.log('Auth :', auth);

      if (auth.user) {
        // this.user = auth.user;
        try {
          this.$router.replace('/');
        } catch (error) {}
      }
    }*/
  },
  setup(props, context) {
    console.log('Propriétées :', props);
    console.log('Context :', context);
  },
  methods: {
    ...mapActions('users',{ createNewUser:'create'}),
    onRegister(email, password) {
      console.log('Click');
      this.createNewUser([{email:email,password:password}]).then((res)=>{
        console.log("Utilisateur crée , vérifiez votre email :",res)
      })
    }
  }
};
</script>

<style lang="scss">
.my-card {
  width: 100%;

  max-width: 400px;
}

.mymy {
  background-color: #ff0000;
  //background: url('https://cdn.quasar.dev/img/parallax2.jpg');
}
</style>
