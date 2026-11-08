// Source of test/fixtures/cxx-symbols (mangled C++ names for the demangling e2e step):
//   g++ -O1 -o test/fixtures/cxx-symbols test/fixtures/cxx-symbols.cpp   (GCC 14, x86-64 Linux)
#include <cstdio>
#include <vector>
#include <string>
namespace geom {
struct Point { int x, y; __attribute__((noinline)) int dot(const Point& o) const { return x*o.x + y*o.y; } };
template <typename T> __attribute__((noinline)) T sum(const std::vector<T>& v) { T s{}; for (auto& e : v) s += e; return s; }
__attribute__((noinline)) int area(int w, int h) { return w * h; }
}
__attribute__((noinline)) int helper(const std::string& s) { return (int)s.size() + 0x862; }
int main(int argc, char** argv) {
  geom::Point a{argc, 2}, b{3, 4};
  std::vector<int> v{1, 2, argc};
  std::string s(argv[0]);
  printf("Conflicting %d %d %d %d\n", a.dot(b), geom::sum(v), geom::area(argc, 7), helper(s));
  return 0;
}
