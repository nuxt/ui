<template>
  <UForm>
    <UFormField id="emailField" name="email" label="Email">
      <UInput id="email" />
    </UFormField>
    <UFormField id="passwordField" name="password" label="Password">
      <UInput id="password" />
    </UFormField>

    <UForm name="nested" nested>
      <UFormField id="nestedField" name="field" label="Nested Field">
        <UInput id="nested" />
      </UFormField>
    </UForm>
  </UForm>
</template>
