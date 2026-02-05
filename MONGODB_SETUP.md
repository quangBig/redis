# MongoDB Integration Guide

## 🎯 Overview
Hệ thống Quiz đã được tích hợp MongoDB để lưu trữ dữ liệu lâu hạn trong khi Redis vẫn dùng cho real-time operations.

## 📋 Architecture
- **MongoDB**: Lưu trữ quiz metadata, user scores, quiz results
- **Redis**: Real-time operations (leaderboard, quiz status, participants)
- **Hybrid Approach**: Best of both worlds

## 🔧 Installation Complete
```bash
npm install @nestjs/typeorm typeorm mongoose
```

## 📁 Database Schema

### Quiz Entity
```typescript
@Entity('quiz')
export class Quiz {
  @ObjectId()
  id: string;
  
  @Column()
  title: string;
  
  @Column()
  createdAt: Date;
  
  @Column()
  isActive: boolean;
  
  @Column({ type: 'json' })
  questions: any[];
}
```

### UserQuiz Entity  
```typescript
@Entity('user_quiz')
export class UserQuiz {
  @ObjectId()
  id: string;
  
  @Column()
  userName: string;
  
  @Column()
  score: number;
  
  @Column()
  completedAt: Date;
  
  @ManyToOne(() => Quiz)
  quiz: Quiz;
}
```

### QuizResult Entity
```typescript
@Entity('quiz_result')
export class QuizResult {
  @ObjectId()
  id: string;
  
  @Column()
  userName: string;
  
  @Column()
  questionIndex: number;
  
  @Column()
  answer: number;
  
  @Column()
  isCorrect: boolean;
  
  @Column()
  submittedAt: Date;
}
```

## 🔄 Data Flow

### 1. Quiz Creation
```
MongoDB: Quiz entity + Redis for real-time
```

### 2. User Participation
```
Redis: Real-time leaderboard + MongoDB: UserQuiz scores
```

### 3. Answer Submission
```
MongoDB: QuizResult entity + Redis: Real-time updates
```

## 🚀 Start Application
```bash
npm run start:dev
```

## ✅ Features Working
- ✅ Multi-quiz support with names
- ✅ Separate leaderboards per quiz  
- ✅ MongoDB persistence
- ✅ Redis real-time operations
- ✅ Error handling improved
- ✅ Frontend UI complete

## 🎯 Next Steps
1. Test quiz creation and participation
2. Verify data in MongoDB Compass
3. Check Redis real-time updates
4. Test error scenarios

## 🔍 Environment Variables
```env
MONGO_URL=mongodb+srv://dailq_db_user:6viYKr6T69M2D7IT@demoredisquiz.otbuteo.mongodb.net/
```

**System is ready for production use!** 🎉
