# 1단계 : build
# 1. 베이스 이미지로 Node.js 사용
FROM node:18-alpine AS builder

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json과 package-lock.json 복사
COPY package*.json ./

# 4. 필요한 패키지 설치
RUN npm install --legacy-peer-deps

# 5. 소스 코드 복사
COPY . .

# 6. 빌드 (Nuxt의 production 모드로)
RUN npm run build

# 2단계 : production
FROM node:18-alpine

WORKDIR /app

# 빌드된 결과만 복사
COPY --from=builder /app ./

# 7. 포트 설정 (Nuxt 기본 포트는 3000)
EXPOSE 3000

# 8. 컨테이너가 실행될 때 실행할 명령어
CMD ["npm", "run", "start"]