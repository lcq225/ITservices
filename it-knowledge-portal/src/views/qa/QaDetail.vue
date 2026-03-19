<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { questions, answers } from '@/api/mock'
import { sanitizeHTML } from '@/utils/xss'

const route = useRoute()
const router = useRouter()
const question = ref(questions[0])
const answersList = ref<typeof answers>([])

const getSafeContent = (html: string) => sanitizeHTML(html)

onMounted(() => {
  const id = Number(route.params.id)
  const found = questions.find(q => q.id === id)
  if (found) {
    question.value = found
    answersList.value = answers.filter(a => a.questionId === id)
  }
})

const handleLike = async (answerId: number) => {
  try {
    const answer = answersList.value.find(a => a.id === answerId)
    if (answer) answer.likes++
    ElMessage.success('点赞成功')
  } catch {
    ElMessage.error('点赞失败')
  }
}

const handleQuestionLike = async () => {
  try {
    question.value.likes++
    ElMessage.success('点赞成功')
  } catch {
    ElMessage.error('点赞失败')
  }
}
</script>

<template>
  <div class="qa-detail">
    <div class="container">
      <el-button text @click="router.back()">
        <el-icon><ArrowLeft /></el-icon> 返回
      </el-button>
      
      <div class="question-card">
        <div class="question-header">
          <h1 class="question-title">{{ question.title }}</h1>
          <div class="question-meta">
            <el-avatar :size="40" :src="question.authorAvatar" />
            <div class="meta-info">
              <span class="author">{{ question.author }}</span>
              <span class="date">发布于 {{ question.createdAt }}</span>
            </div>
            <el-tag v-for="tag in question.tags" :key="tag">{{ tag }}</el-tag>
          </div>
        </div>
        
        <el-divider />
        
        <div class="question-content">
          <p>{{ question.content }}</p>
        </div>
        
        <div class="question-actions">
          <el-button @click="handleQuestionLike">
            <el-icon><Star /></el-icon> 点赞 ({{ question.likes }})
          </el-button>
          <span class="views">浏览 {{ question.views }}</span>
        </div>
      </div>
      
      <div class="answers-section">
        <h3>{{ answersList.length }} 个回答</h3>
        
        <div v-for="answer in answersList" :key="answer.id" class="answer-card">
          <div class="answer-header">
            <div class="author-info">
              <el-avatar :size="36" :src="answer.authorAvatar" />
              <span class="author">{{ answer.author }}</span>
              <el-tag v-if="answer.isAccepted" type="success" size="small">已采纳</el-tag>
            </div>
          </div>
          <div class="answer-content" v-html="getSafeContent(answer.content)"></div>
          <div class="answer-actions">
            <el-button size="small" @click="handleLike(answer.id)">
              <el-icon><Star /></el-icon> 点赞 ({{ answer.likes }})
            </el-button>
          </div>
        </div>
        
        <el-empty v-if="answersList.length === 0" description="暂无回答，我来帮你解答！" />
      </div>
      
      <div class="answer-form">
        <h3>我要回答</h3>
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入您的回答..."
        />
        <el-button type="primary" style="margin-top: 12px">提交回答</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.qa-detail {
  padding-bottom: 40px;
}

.question-card,
.answer-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-top: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.question-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 16px;
  color: var(--text-primary);
}

.question-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-info {
  display: flex;
  flex-direction: column;
}

.author {
  font-weight: 600;
  color: var(--text-primary);
}

.date {
  font-size: 13px;
  color: var(--text-muted);
}

.question-content p {
  line-height: 1.8;
  color: var(--text-secondary);
  font-size: 15px;
}

.question-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.views {
  color: var(--text-muted);
  font-size: 14px;
}

.answers-section {
  margin-top: 24px;
}

.answers-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.answer-header {
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.answer-content {
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.answer-actions {
  display: flex;
  gap: 12px;
}

.answer-form {
  margin-top: 24px;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.answer-form h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
}
</style>
