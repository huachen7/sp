<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <h1 class="text-9xl font-bold text-gray-300">404</h1>
      <h2 class="mt-4 text-3xl font-extrabold text-gray-900">Page Not Found</h2>
      <p class="mt-2 text-gray-600">The page you are looking for doesn't exist or has been moved.</p>
      <div class="mt-6">
        <router-link to="/" class="btn btn-primary">
          Go to Homepage
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
};
</script> 