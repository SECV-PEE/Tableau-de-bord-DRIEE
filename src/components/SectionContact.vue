<template>
  <div id="section-contact" class="section-contact">
    <div class="separateur">
      <h1 class="grand-titre">Contact</h1>
    </div>
    <h4>Pour toute question ou suggestion, n'hésitez pas à nous contacter 
      <a class="mail-icon" href="mailto:florence.levy@developpement-durable.gouv.fr">
        <v-icon large>mdi-email</v-icon>
      </a>
    </h4>
  </div>
</template>

<script>
export default {
  name: 'SectionContact',
}
</script>

<style>
.section-contact {
  padding: inherit;
}

.mail-icon {
  text-decoration: none;
}
</style>