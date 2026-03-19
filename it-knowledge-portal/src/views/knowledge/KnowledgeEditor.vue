<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { systems, articles } from '@/api/mock'
import E from 'wangeditor'

const route = useRoute()
const router = useRouter()
const isEdit = ref(false)
const articleId = ref<number | null>(null)

const form = ref({
  title: '',
  content: '',
  systemId: '',
  tags: [] as string[],
  attachments: [] as any[]
})

const editorRef = ref<HTMLDivElement>()
let editor: E | null = null

onMounted(() => {
  if (route.path.includes('edit')) {
    isEdit.value = true
    articleId.value = Number(route.params.id)
    const article = articles.find(a => a.id === articleId.value)
    if (article) {
      form.value.title = article.title
      form.value.content = article.content
      form.value.systemId = String(article.systemId || '')
      form.value.tags = article.tags
    }
  }
  
  if (editorRef.value) {
    editor = new E(editorRef.value)
    editor.create()
    if (form.value.content) {
      editor.txt.html(form.value.content)
    }
  }
})

onBeforeUnmount(() => {
  editor?.destroy()
})

const handleSubmit = () => {
  if (editor) {
    const html = editor.txt.html()
    if (typeof html === 'string') {
      form.value.content = html
    }
  }
  console.log('Submit:', form.value)
  router.push('/knowledge')
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <div class="knowledge-editor">
    <div class="container">
      <div class="editor-card">
        <h1 class="page-title">{{ isEdit ? '编辑知识' : '创建知识' }}</h1>
        
        <el-form :model="form" label-width="100px">
          <el-form-item label="标题">
            <el-input v-model="form.title" placeholder="请输入文档标题" />
          </el-form-item>
          
          <el-form-item label="所属系统">
            <el-select v-model="form.systemId" placeholder="请选择系统" style="width: 100%">
              <el-option v-for="s in systems" :key="s.id" :label="s.name" :value="String(s.id)" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="标签">
            <el-select v-model="form.tags" multiple placeholder="请选择标签" style="width: 100%">
              <el-option label="操作指南" value="操作指南" />
              <el-option label="运维" value="运维" />
              <el-option label="故障排查" value="故障排查" />
              <el-option label="安全" value="安全" />
              <el-option label="入门" value="入门" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="内容">
            <div ref="editorRef" class="editor-container"></div>
          </el-form-item>
          
          <el-form-item label="附件">
            <el-upload
              action="#"
              :auto-upload="false"
              :on-change="(file: any) => form.attachments.push(file)"
              multiple
            >
              <el-button><el-icon><Upload /></el-icon> 上传附件</el-button>
              <template #tip>
                <div class="upload-tip">支持 PDF、Word、Excel、图片等文件，单个文件不超过 10MB</div>
              </template>
            </el-upload>
            <div v-if="form.attachments.length" class="file-list">
              <div v-for="(file, idx) in form.attachments" :key="idx" class="file-item">
                {{ file.name }}
                <el-icon @click="form.attachments.splice(idx, 1)"><Close /></el-icon>
              </div>
            </div>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
            <el-button @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-editor {
  padding-bottom: 40px;
}

.editor-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.editor-card .page-title {
  margin-bottom: 24px;
}

.editor-container {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  min-height: 400px;
}

.upload-tip {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 8px;
}

.file-list {
  margin-top: 12px;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--bg-color);
  border-radius: 4px;
  margin-bottom: 8px;
}
</style>
