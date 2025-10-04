<script>
let port;
let reader;
let keepReading = true;

async function connectSerial() {
  try {
    // Hỏi người dùng chọn cổng COM Arduino
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    reader = decoder.readable.getReader();

    document.getElementById("status").textContent = "✅ Đã kết nối Arduino";

    // Đọc dữ liệu liên tục
    while (keepReading) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        const [temp, hum] = value.trim().split(",");
        if (temp && hum) {
          document.getElementById("temp").textContent = temp;
          document.getElementById("hum").textContent = hum;

          // Lưu để info.html đọc lại
          localStorage.setItem("temp", temp);
          localStorage.setItem("hum", hum);
        }
      }
    }
  } catch (err) {
    document.getElementById("status").textContent = "❌ Lỗi kết nối: " + err;
  }
}
</script>
