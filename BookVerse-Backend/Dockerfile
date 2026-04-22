# Sử dụng hình ảnh JDK 17 chính thức làm nền tảng
FROM eclipse-temurin:17-jdk-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép các file cấu hình Maven và wrapper
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Cấp quyền thực thi và sửa lỗi xuống dòng Windows (CRLF)
RUN chmod +x mvnw && sed -i 's/\r$//' mvnw

# Tải xuống các dependencies (giúp build nhanh hơn ở các lần sau)
RUN ./mvnw dependency:go-offline

# Sao chép toàn bộ mã nguồn vào container
COPY src ./src

# Build ứng dụng, bỏ qua chạy test để tiết kiệm thời gian
RUN ./mvnw package -DskipTests

# Chạy ứng dụng khi container khởi động
ENTRYPOINT ["java", "-jar", "target/bookverse-backend-0.0.1-SNAPSHOT.jar"]
