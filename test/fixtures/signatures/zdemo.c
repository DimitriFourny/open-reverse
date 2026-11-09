/* Library signatures fixture: zlib linked statically into a dynamically linked program.
 * Build (Debian 13, gcc 14, zlib1g-dev 1.3.1):
 *   gcc -O2 -o zdemo zdemo.c -Wl,-Bstatic -lz -Wl,-Bdynamic && strip -o zdemo-stripped zdemo
 * zlib-1.3.1-x86_64 (web/public/signatures) names its zlib functions in zdemo-stripped. */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <zlib.h>

static int roundtrip(const char *text, unsigned char *packed, uLongf *packed_len) {
  unsigned char back[256];
  uLongf back_len = sizeof back;
  if (compress2(packed, packed_len, (const Bytef *)text, strlen(text) + 1, Z_BEST_COMPRESSION) != Z_OK) return -1;
  if (uncompress(back, &back_len, packed, *packed_len) != Z_OK) return -1;
  return memcmp(back, text, back_len) == 0;
}

int main(int argc, char **argv) {
  const char *text = argc > 1 ? argv[1] : "hello, hello, hello, signatures";
  unsigned char packed[256];
  uLongf packed_len = sizeof packed;
  int ok = roundtrip(text, packed, &packed_len);
  uLong crc = crc32(0L, (const Bytef *)text, (uInt)strlen(text));
  uLong adler = adler32(1L, (const Bytef *)text, (uInt)strlen(text));
  printf("%s: %lu -> %lu bytes, ok=%d crc32=%08lx adler32=%08lx\n", zlibVersion(), (unsigned long)strlen(text), (unsigned long)packed_len, ok, crc, adler);
  return ok ? EXIT_SUCCESS : EXIT_FAILURE;
}
