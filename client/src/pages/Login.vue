<template>
  <q-page class="fit row justify-center bg-white q-py-xs">
    <!-- content -->

    <div class="column justify-center self-center q-pb-xs q-px-md" style="width: 400px">
      <div class="row justify-center self-center q-pb-none q-mb-none" style="width: 150px">
        <q-img :src="url" spinner-color="white" />
      </div>
      <div class="text-center q-pt-noe text-h5 q-pb-md">
        Bienvenue
      </div>
      <q-card class="my-card" bordered>
        <q-card-section
          style="width: 100%"
          class="text-center bg-primary text-white text-h5 q-py-xs"
        >Identification</q-card-section>
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
        <q-card-actions class="row items-center justify-center q-mt-md q-py-none">
          <div class="q-gutter-xl">
            <q-btn
              color="primary"
              icon="lock"
              text-color="white"
              label="Connexion"
              @click="onSubmit(email,password)"
              :disable="(email=='')&&(password=='')"
            />

          </div>
        </q-card-actions>
        <q-card-section
          class="col text-center"
          separator
        >Entrez votre email et mot de passe et si vous n'êtes pas incrit cliquez ci-dessous</q-card-section>
      </q-card>
    </div>
    <div class="row fit justify-center q-pa-xs">
    <q-btn
              color="primary"
              text-color="white"
              label="S'inscrire..."
              no-caps
              to="/register"
            />
            </div>
            <!-- @click="onRegister(email,password)"
              :disable="(email=='')&&(password=='')"-->
  </q-page>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'LoginPage',
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
    async checkIsAuthenticated() {
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
    }
  },
  setup(props, context) {
    console.log('Propriétées :', props);
    console.log('Context :', context);
  },
  methods: {
    onSubmit(email, password) {
      console.log('Click');
      this.$store
        .dispatch('auth/authenticate', { strategy: 'local', email, password })
        .then(res => {
          console.log('Result :', res.user);
          this.$router.replace('/');
        })
        // Just use the returned error instead of mapping it from the store.
        .catch(err => {
          // Convert the error to a plain object and add a message.
          console.log('Erreur fatale');
          let type = err.className;
          err = Object.assign({}, err);
          err.message =
            type === 'not-authenticated'
              ? 'Incorrect email or password.'
              : 'An error prevented login.';

          this.error = err;
        });
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
