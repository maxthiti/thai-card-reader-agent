# Thai Card Reader Agent

WebSocket server สำหรับอ่านบัตรประชาชนไทยและส่งข้อมูลให้เว็บ (port 4000)

## การติดตั้ง

```bash
cd thai-card-reader-agent
npm install
```

## การใช้งาน

### 1. เปิด Agent

```bash
npm start
```

จะเห็นข้อความ:

```
✅ Thai Card Reader Agent listening on ws://localhost:4000
```

### 2. เปิดเว็บ OnsiteRegister2.vue

- รีเฟรชหน้าเว็บ
- เปิด Console (F12 → Console)
- ดูว่าขึ้น "Card Reader (TDKWAgent) is connected." หรือไม่

### 3. ทดสอบอ่านบัตร

- เสียบบัตรประชาชนจริง
- สังเกตว่า field ชื่อ/เลขบัตร/ที่อยู่ ถูกกรอกหรือไม่

## คำอธิบายโปรแกรม

### ไฟล์: server.js

- เปิด WebSocket ที่ `ws://localhost:4000`
- ส่ง `AgentStatusE` พอ client เชื่อมต่อ
- รองรับ commands: GetReaderList, SelectReader, ReadIDCard
- ส่งข้อมูล Thai ID Card ในรูป JSON

### Data Format

```json
{
  "citizenId": "1234567890123",
  "firstNameTH": "สมชาย",
  "lastNameTH": "ใจดี",
  "address": "ที่อยู่...",
  "photo": "base64string..."
}
```

## ข้อสำคัญ

⚠️ **ตอนนี้** โปรแกรมส่ง Mock data สำหรับทดสอบเท่านั้น

เพื่อให้อ่านบัตรจริง ต้องทำสิ่งนี้:

### Option 1: ใช้ PC/SC API (ทำได้บน Windows)

```bash
npm install pcsclite
```

แล้วแทนที่ `mockCardData` ด้วย code ที่อ่านจากเครื่อง Zoweetek

### Option 2: ใช้ Library อื่น

ค้นหา "Node.js Thai ID Card reader" library ที่ support Zoweetek

## Troubleshooting

**Q: ยังไม่อ่านบัตรจริง**
A: โปรแกรมตอนนี้ส่งข้อมูล mock เพื่อทดสอบว่าเชื่อมต่อได้หรือไม่ เมื่อเชื่อมต่อได้แล้ว ให้ต่อ real card reading library

**Q: Agent ไม่เชื่อมต่อ**
A: เช็ก:

1. Agent เปิดอยู่หรือยัง? (`npm start` ยังรัน?)
2. Port 4000 ว่างอยู่หรือ? (`netstat -ano | findstr :4000`)
3. Firewall บล็อกพอร์ต 4000 ไหม?

## ต่อไป

1. ✅ Agent เชื่อมต่อได้ → ลองอ่านบัตรจริง
2. ❌ Agent ยังเชื่อมไม่ได้ → เช็ก port/firewall
3. 🔧 ต้องใช้ real card reading → เพิ่ม PC/SC logic

(nodejs.org)
& "C:\Users\Computer01\.nvm\versions\node\v20.11.0\bin\node.exe" -v
& "C:\Users\Computer01\.nvm\versions\node\v20.11.0\bin\node.exe" uninstall-service.js
& "C:\Users\Computer01\.nvm\versions\node\v20.11.0\bin\node.exe" install-service.js

Get-Service -Name "thaicardreaderagent.exe"
Get-Content "C:\Users\Computer01\Thitipong\thai-card-reader-agent\daemon\thaicardreaderagent.err.log" -Tail 50

เริ่มแรก
1.โหลด node.js v20 และ https://www.dnielectronico.es/
2.โหลด python อย่าลืมติ๊ก add path
3.โหลด visual studio
4.เลือก Desktop development with C++
5.ลงไฟล์นี้
6.npm install
7.node install-service.js
