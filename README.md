# statlogs

# สร้างฐานข้อมูล
db.createUser({
  user: "adminStatlog",
  pwd: "passStatlog",
  roles: [{ role: "dbAdmin", db: "StatlogDB" }, "dbAdmin"]
})

# รันโปรแกรม
ืnpm start

