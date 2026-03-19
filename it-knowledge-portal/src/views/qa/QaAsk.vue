<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  title: '',
  content: '',
  tags: [] as string[]
})

const handleSubmit = () => {
  console.log('Submit question:', form.value)
  router.push('/qa')
}
</script>

<template>
  <div class="qa-ask">
    <div class="container">
      <div class="ask-card">
        <h1 class="page-title">发布问题</h1>
        
        <el-form :model="form" label-width="100px">
          <el-form-item label="问题标题">
            <el-input v-model="form.title" placeholder="请简要描述您的问题" />
          </el-form-item>
          
          <el-form-item label="问题详情">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="6"
              placeholder="请详细描述您遇到的问题..."
            />
          </el-form-item>
          
          <el-form-item label="标签">
            <el-select v-model="form.tags" multiple placeholder="请选择相关标签" style="width: 100%">
              <el-option label="ERP" value="ERP" />
              <el-option label="OA" value="OA" />
              <el-option label="VPN" value="VPN" />
              <el-option label="网络" value="网络" />
              <el-option label="账号" value="账号" />
              <el-option label="登录" value="登录" />
            </el-select>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="handleSubmit">发布问题</el-button>
            <el-button @click="router.back()">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qa-ask {
  padding-bottom: 40px;
}

.ask-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>
