// Source of test/fixtures/diff/diffme-v1 and diffme-v2 (the binary diff e2e step):
//   gcc -O1 -o test/fixtures/diff/diffme-v1 test/fixtures/diff/diffme.c
//   gcc -O1 -DV2 -o test/fixtures/diff/diffme-v2 test/fixtures/diff/diffme.c   (GCC 14, x86-64 Linux)
// v2 changes: checksum's multiplier (a constant), parse_level gains a branch, the static
// helper_add is renamed add_values (same body), and validate_name is new (called from main).
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define NOINLINE __attribute__((noinline))

NOINLINE unsigned checksum(const char *s) {
  unsigned h = 7;
#ifdef V2
  for (; *s; s++) h = h * 33 + (unsigned char)*s;
#else
  for (; *s; s++) h = h * 31 + (unsigned char)*s;
#endif
  return h;
}

NOINLINE int parse_level(const char *s) {
  int n = atoi(s);
  if (n < 0) {
    puts("level: negative");
    return 0;
  }
#ifdef V2
  if (n > 9) {
    puts("level: too high");
    return 9;
  }
#endif
  return n;
}

#ifdef V2
static NOINLINE int add_values(int a, int b) { return a * 3 + b; }
#define HELPER add_values
#else
static NOINLINE int helper_add(int a, int b) { return a * 3 + b; }
#define HELPER helper_add
#endif

NOINLINE int count_words(const char *s) {
  int n = 0, in = 0;
  for (; *s; s++) {
    if (*s == ' ' || *s == '\t') in = 0;
    else if (!in) in = 1, n++;
  }
  return n;
}

NOINLINE void reverse_string(char *s) {
  size_t n = strlen(s);
  for (size_t i = 0; i < n / 2; i++) {
    char t = s[i];
    s[i] = s[n - 1 - i];
    s[n - 1 - i] = t;
  }
}

NOINLINE long sum_array(const int *v, int n) {
  long s = 0;
  for (int i = 0; i < n; i++) s += v[i];
  return s;
}

NOINLINE void usage(const char *prog) {
  fprintf(stderr, "usage: %s <name> <level>\n", prog);
  exit(2);
}

#ifdef V2
NOINLINE int validate_name(const char *s) {
  size_t n = strlen(s);
  if (n == 0 || n > 32) {
    puts("invalid name");
    return 0;
  }
  for (size_t i = 0; i < n; i++)
    if (s[i] == '/') return 0;
  return 1;
}
#endif

int main(int argc, char **argv) {
  if (argc < 3) usage(argv[0]);
#ifdef V2
  if (!validate_name(argv[1])) return 1;
#endif
  char buf[64];
  snprintf(buf, sizeof buf, "%s", argv[1]);
  reverse_string(buf);
  int v[3] = {argc, parse_level(argv[2]), count_words(argv[1])};
  printf("%s %u %d %ld\n", buf, checksum(argv[1]), HELPER(v[0], v[1]), sum_array(v, 3));
  return 0;
}
