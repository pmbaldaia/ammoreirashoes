<script setup>
definePageMeta({
  layout: "error",
});

const error = useError();
error.value = createError({
  statusCode: 404,
  statusMessage: "Página não encontrada",
});
</script>
