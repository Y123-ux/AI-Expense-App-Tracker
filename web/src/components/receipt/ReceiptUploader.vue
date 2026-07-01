<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ loading: boolean }>()
const emit = defineEmits<{ upload: [file: File] }>()

const preview = ref<string | null>(null)
const dragOver = ref(false)

function handleFile(file: File) {
  if (!file.type.startsWith('image/')) return

  const reader = new FileReader()
  reader.onload = (e) => {
    preview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  emit('upload', file)
}

function onFileInput(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files?.[0]) {
    handleFile(input.files[0])
  }
}

function onDrop(event: DragEvent) {
  dragOver.value = false
  if (event.dataTransfer?.files?.[0]) {
    handleFile(event.dataTransfer.files[0])
  }
}
</script>

<template>
  <div>
    <div
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="onDrop"
      class="border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer"
      :class="dragOver ? 'border-accent-300 bg-accent-50' : 'border-gray-300 hover:border-primary-300'"
      @click="($refs.fileInput as HTMLInputElement)?.click()"
    >
      <div v-if="preview" class="mb-4">
        <img :src="preview" alt="Receipt preview" class="max-h-48 mx-auto rounded-lg" />
      </div>
      <div v-else>
        <p class="text-4xl mb-3">📸</p>
        <p class="text-gray-600 font-medium">Drop a receipt image here</p>
        <p class="text-gray-400 text-sm mt-1">or click to browse (JPEG, PNG, WebP)</p>
      </div>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="onFileInput"
      class="hidden"
    />
  </div>
</template>
