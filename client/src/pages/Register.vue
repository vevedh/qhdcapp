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
            <div class="col text-center text-red" v-if="successCreated">Utilisateur crée, vérifiez votre messagerie</div>
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
          <div class="q-gutter-xs">
            <q-btn
              color="primary"
              icon="arrow_left"
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

import {  Notify } from "quasar";
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'RegisterPage',
  data() {
    return {
      successCreated:false,
      email: '',
      password: '',
      url: 'logo_hdcapp.png',
      error: '',
      dense: true
    };
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'user']),
  },
  setup(props, context) {
    console.log('Propriétées :', props);
    console.log('Context :', context);
  },
  mounted() {
    console.log("Store :",this.$store)
    console.log("Feathers :",this.$FeathersVuex)
  },
  methods: {
    ...mapActions('users',{ createNewUser:'create'}),
    onRegister(email, password) {
      console.log('Click');
      this.createNewUser([{email:email,password:password}]).then((res)=>{
        console.log("Utilisateur crée , vérifiez votre email :",res)
        if (res && res.email!='') {
          this.successCreated = true
        }
      }).catch((err)=>{
        Notify.create({
              message: `Erreur : Ce compte existe déjà ou ne peut être crée!`,
              color: "negative"
            });
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
