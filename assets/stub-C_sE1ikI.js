import{a_ as Mt,p as xt,O as ur,aY as si,S as dr}from"./index-CLzq1op1.js";function mr(s,e){return s==="macho"&&e.startsWith("_")?e.slice(1):e}function Ks(s,e){if(s==="macho"){const t=mr(s,e),i=t.indexOf("$");return i>0?t.slice(0,i):t}if(s==="elf"){const t=e.indexOf("@");return t>0?e.slice(0,t):e}return e.startsWith("__imp_")?e.slice(6):e}const pr={mode_t:["ushort","uint","ushort"],dev_t:["int","ulong","uint"],ino_t:["uint64","ulong","ushort"],nlink_t:["ushort","ulong","ushort"],clock_t:["ulong","long","long"],time_t:["long","long","int64"],suseconds_t:["int","long","long"],useconds_t:["uint","uint","uint"],off_t:["int64","long","long"],blksize_t:["int","long","int"],blkcnt_t:["int64","long","int64"],wint_t:["int","uint","ushort"],wctype_t:["uint","ulong","ushort"],nfds_t:["uint","ulong","ulong"],speed_t:["ulong","uint","ulong"],tcflag_t:["ulong","uint","ulong"],pthread_key_t:["ulong","uint","uint"],rlim_t:["uint64","ulong","uint64"],fsblkcnt_t:["uint","ulong","uint"],fsfilcnt_t:["uint","ulong","uint"],sa_family_t:["uchar","ushort","ushort"]},ni={v:"void",c:"char",a:"schar",h:"uchar",s:"short",t:"ushort",i:"int",u:"uint",l:"long",m:"ulong",q:"longlong",r:"ulonglong",j:"int64",k:"uint64",f:"float",d:"double",e:"longdouble",o:"bool",w:"wchar",z:"size_t",y:"ssize_t",p:"fnptr",x:"va_list"},fr="macOS SDK 27.0 usr/include",Cr=["c-extras.h","_abort.h","_stdlib.h","math.h","malloc/_malloc.h","_time.h","_wchar.h","_stdio.h","_locale_posix2008.h","fenv.h","_inttypes.h","_ctype.h","___wctype.h","_wctype.h","_locale.h","setjmp.h","_string.h","_printf.h","signal.h","locale.h","sys/signal.h","runetype.h"],hr=`&locale_t=@struct _xlocale;
__cxa_atexit|i|function:p,argument:*v,dso_handle:*v||0
__cxa_finalize|v|dso_handle:*v||0
__cxa_thread_atexit_impl|i|function:p,argument:*v,dso_handle:*v||0
abort|v||n|1
abs|i|j:i||2
acos|d|x:d||3
acosf|f|x:f||3
acosh|d|x:d||3
acoshf|f|x:f||3
acoshl|e|x:e||3
acosl|e|x:e||3
aligned_alloc|*v|alignment:z,size:z|a1|4
asctime|*c|tm:^@struct tm;||5
asctime_r|*c|tm:^@struct tm;,buf:*c||5
asin|d|x:d||3
asinf|f|x:f||3
asinh|d|x:d||3
asinhf|f|x:f||3
asinhl|e|x:e||3
asinl|e|x:e||3
at_quick_exit|i|func:p||2
atan|d|x:d||3
atan2|d|x:d,y:d||3
atan2f|f|x:f,y:f||3
atan2l|e|x:e,y:e||3
atanf|f|x:f||3
atanh|d|x:d||3
atanhf|f|x:f||3
atanhl|e|x:e||3
atanl|e|x:e||3
atexit|i|func:p||2
atof|d|nptr:^c||2
atoi|i|nptr:^c||2
atol|l|nptr:^c||2
atoll|q|nptr:^c||2
bsearch|*v|key:^v,base:^v,nel:z,width:z,compar:p||2
btowc|$wint_t;|c:i||6
calloc|*v|count:z,size:z|a0a1|4
cbrt|d|x:d||3
cbrtf|f|x:f||3
cbrtl|e|x:e||3
ceil|d|x:d||3
ceilf|f|x:f||3
ceill|e|x:e||3
clearerr|v|stream:*@FILE;||7
clock|$clock_t;|||5
copysign|d|x:d,y:d||3
copysignf|f|x:f,y:f||3
copysignl|e|x:e,y:e||3
cos|d|x:d||3
cosf|f|x:f||3
cosh|d|x:d||3
coshf|f|x:f||3
coshl|e|x:e||3
cosl|e|x:e||3
ctime|*c|clock:^$time_t;||5
ctime_r|*c|clock:^$time_t;,buf:*c||5
difftime|d|time1:$time_t;,time0:$time_t;||5
duplocale|&locale_t;|a1:&locale_t;||8
erf|d|x:d||3
erfc|d|x:d||3
erfcf|f|x:f||3
erfcl|e|x:e||3
erff|f|x:f||3
erfl|e|x:e||3
exit|v|status:i|n|2
exp|d|x:d||3
exp2|d|x:d||3
exp2f|f|x:f||3
exp2l|e|x:e||3
expf|f|x:f||3
expl|e|x:e||3
expm1|d|x:d||3
expm1f|f|x:f||3
expm1l|e|x:e||3
fabs|d|x:d||3
fabsf|f|x:f||3
fabsl|e|x:e||3
fclose|i|stream:*@FILE;||7
fdim|d|x:d,y:d||3
fdimf|f|x:f,y:f||3
fdiml|e|x:e,y:e||3
feclearexcept|i|a1:i||9
fegetenv|i|a1:*@fenv_t;||9
fegetexceptflag|i|a1:*t,a2:i||9
fegetround|i|||9
feholdexcept|i|a1:*@fenv_t;||9
feof|i|stream:*@FILE;||7
feraiseexcept|i|a1:i||9
ferror|i|stream:*@FILE;||7
fesetenv|i|a1:^@fenv_t;||9
fesetexceptflag|i|a1:^t,a2:i||9
fesetround|i|a1:i||9
fetestexcept|i|a1:i||9
feupdateenv|i|a1:^@fenv_t;||9
fflush|i|stream:*@FILE;||7
fgetc|i|stream:*@FILE;||7
fgetpos|i|file:*@FILE;,pos:*@fpos_t;||7
fgets|*c|s:*c,size:i,stream:*@FILE;||7
fgetwc|$wint_t;|stream:*@FILE;||6
fgetws|*w|ws:*w,n:i,stream:*@FILE;||6
floor|d|x:d||3
floorf|f|x:f||3
floorl|e|x:e||3
fma|d|x:d,y:d,z:d||3
fmaf|f|x:f,y:f,z:f||3
fmal|e|x:e,y:e,z:e||3
fmax|d|x:d,y:d||3
fmaxf|f|x:f,y:f||3
fmaxl|e|x:e,y:e||3
fmin|d|x:d,y:d||3
fminf|f|x:f,y:f||3
fminl|e|x:e,y:e||3
fmod|d|x:d,y:d||3
fmodf|f|x:f,y:f||3
fmodl|e|x:e,y:e||3
fopen|*@FILE;|filename:^c,mode:^c||7
fprintf|i|file:*@FILE;,format:^c|vf1|7
fputc|i|c:i,stream:*@FILE;||7
fputs|i|s:^c,stream:*@FILE;||7
fputwc|$wint_t;|c:w,stream:*@FILE;||6
fputws|i|ws:^w,stream:*@FILE;||6
fread|m|ptr:*v,size:z,nitems:z,stream:*@FILE;||7
free|v|ptr:*v||4
freelocale|i|a1:&locale_t;||8
freopen|*@FILE;|filename:^c,mode:^c,stream:*@FILE;||7
frexp|d|value:d,exp:*i||3
frexpf|f|value:f,exp:*i||3
frexpl|e|value:e,exp:*i||3
fscanf|i|file:*@FILE;,format:^c|vs1|7
fseek|i|stream:*@FILE;,offset:l,whence:i||7
fsetpos|i|stream:*@FILE;,pos:^@fpos_t;||7
ftell|l|stream:*@FILE;||7
fwide|i|stream:*@FILE;,mode:i||6
fwprintf|i|file:*@FILE;,format:^w|v|6
fwrite|m|ptr:^v,size:z,nitems:z,stream:*@FILE;||7
fwscanf|i|file:*@FILE;,format:^w|v|6
getc|i|stream:*@FILE;||7
getchar|i|||7
getdate|*@struct tm;|a1:^c||5
getenv|*c|name:^c||2
gets|*c|s:*c||7
getwc|$wint_t;|stream:*@FILE;||6
getwchar|$wint_t;|||6
gmtime|*@struct tm;|clock:^$time_t;||5
gmtime_r|*@struct tm;|clock:^$time_t;,result:*@struct tm;||5
hypot|d|x:d,y:d||3
hypotf|f|x:f,y:f||3
hypotl|e|x:e,y:e||3
ilogb|i|x:d||3
ilogbf|i|x:f||3
ilogbl|i|x:e||3
imaxabs|j|j:j||a
isalnum|i|c:i||b
isalpha|i|c:i||b
isascii|i|c:i||b
isblank|i|c:i||b
iscntrl|i|c:i||b
isdigit|i|c:i||b
isgraph|i|c:i||b
islower|i|c:i||b
isprint|i|c:i||b
ispunct|i|c:i||b
isspace|i|c:i||b
isupper|i|c:i||b
iswalnum|i|wc:$wint_t;||c
iswalpha|i|wc:$wint_t;||c
iswblank|i|wc:$wint_t;||d
iswcntrl|i|wc:$wint_t;||c
iswctype|i|wc:$wint_t;,charclass:$wctype_t;||c
iswdigit|i|wc:$wint_t;||c
iswgraph|i|wc:$wint_t;||c
iswlower|i|wc:$wint_t;||c
iswprint|i|wc:$wint_t;||c
iswpunct|i|wc:$wint_t;||c
iswspace|i|wc:$wint_t;||c
iswupper|i|wc:$wint_t;||c
iswxdigit|i|wc:$wint_t;||c
isxdigit|i|c:i||b
labs|l|j:l||2
ldexp|d|x:d,n:i||3
ldexpf|f|x:f,n:i||3
ldexpl|e|x:e,n:i||3
lgamma|d|x:d||3
lgammaf|f|x:f||3
lgammal|e|x:e||3
llabs|q|j:q||2
llrint|q|x:d||3
llrintf|q|x:f||3
llrintl|q|x:e||3
llround|q|x:d||3
llroundf|q|x:f||3
llroundl|q|x:e||3
localeconv|*@struct lconv;|||e
localtime|*@struct tm;|clock:^$time_t;||5
localtime_r|*@struct tm;|clock:^$time_t;,result:*@struct tm;||5
log|d|x:d||3
log10|d|x:d||3
log10f|f|x:f||3
log10l|e|x:e||3
log1p|d|x:d||3
log1pf|f|x:f||3
log1pl|e|x:e||3
log2|d|x:d||3
log2f|f|x:f||3
log2l|e|x:e||3
logb|d|x:d||3
logbf|f|x:f||3
logbl|e|x:e||3
logf|f|x:f||3
logl|e|x:e||3
longjmp|v|env:*v,val:i|n|f
lrint|l|x:d||3
lrintf|l|x:f||3
lrintl|l|x:e||3
lround|l|x:d||3
lroundf|l|x:f||3
lroundl|l|x:e||3
malloc|*v|size:z|a0|4
mblen|i|s:^c,n:z||2
mbrlen|z|ch:^c,n:z,state:*@__mbstate_t;||6
mbrtowc|z|pwc:*w,s:^c,n:z,ps:*@__mbstate_t;||6
mbsinit|i|ps:^@__mbstate_t;||6
mbsrtowcs|z|dest:*w,psrc:*^c,len:z,state:*@__mbstate_t;||6
mbstowcs|z|pwcs:*w,s:^c,n:z||2
mbtowc|i|pwc:*w,s:^c,n:z||2
memchr|*v|s:^v,c:i,n:z||g
memcmp|i|s1:^v,s2:^v,n:z||g
memcpy|*v|dst:*v,src:^v,n:z||g
memmove|*v|dst:*v,src:^v,len:z||g
memset|*v|b:*v,c:i,len:z||g
mktime|$time_t;|tm:*@struct tm;||5
modf|d|value:d,iptr:*d||3
modff|f|value:f,iptr:*f||3
modfl|e|value:e,iptr:*e||3
nan|d|tagp:^c||3
nanf|f|tagp:^c||3
nanl|e|tagp:^c||3
nearbyint|d|x:d||3
nearbyintf|f|x:f||3
nearbyintl|e|x:e||3
newlocale|&locale_t;|a1:i,a2:^c,a3:&locale_t;||8
nextafter|d|x:d,y:d||3
nextafterf|f|x:f,y:f||3
nextafterl|e|x:e,y:e||3
nexttoward|d|x:d,y:e||3
nexttowardf|f|x:f,y:e||3
nexttowardl|e|x:e,y:e||3
perror|v|s:^c||7
posix_memalign|i|memptr:**v,alignment:z,size:z||4
pow|d|x:d,y:d||3
powf|f|x:f,y:f||3
powl|e|x:e,y:e||3
printf|i|format:^c|vf0|h
putc|i|c:i,stream:*@FILE;||7
putchar|i|c:i||7
puts|i|s:^c||7
putwc|$wint_t;|c:w,stream:*@FILE;||6
putwchar|$wint_t;|ch:w||6
qsort|v|base:*v,nel:z,width:z,compar:p||2
quick_exit|v|status:i|n|2
raise|i|sig:i||i
rand|i|||2
realloc|*v|ptr:*v,size:z|a1|4
remainder|d|x:d,y:d||3
remainderf|f|x:f,y:f||3
remainderl|e|x:e,y:e||3
remove|i|path:^c||7
remquo|d|x:d,y:d,quo:*i||3
remquof|f|x:f,y:f,quo:*i||3
remquol|e|x:e,y:e,quo:*i||3
rename|i|old:^c,new:^c||7
rewind|v|stream:*@FILE;||7
rint|d|x:d||3
rintf|f|x:f||3
rintl|e|x:e||3
round|d|x:d||3
roundf|f|x:f||3
roundl|e|x:e||3
scalbln|d|x:d,n:l||3
scalblnf|f|x:f,n:l||3
scalblnl|e|x:e,n:l||3
scalbn|d|x:d,n:i||3
scalbnf|f|x:f,n:i||3
scalbnl|e|x:e,n:i||3
scanf|i|format:^c|vs0|7
setbuf|v|stream:*@FILE;,buf:*c||7
setjmp|i|env:*v||f
setlocale|*c|category:i,locale:^c||j
setvbuf|i|stream:*@FILE;,buf:*c,mode:i,size:z||7
signal|p|sig:i,func:p||k
sin|d|x:d||3
sinf|f|x:f||3
sinh|d|x:d||3
sinhf|f|x:f||3
sinhl|e|x:e||3
sinl|e|x:e||3
sprintf|i|dest:*c,format:^c|vf1|7
sqrt|d|x:d||3
sqrtf|f|x:f||3
sqrtl|e|x:e||3
srand|v|seed:u||2
sscanf|i|src:^c,format:^c|vs1|7
strcat|*c|s1:*c,s2:^c||g
strchr|*c|s:^c,c:i||g
strcmp|i|s1:^c,s2:^c||g
strcoll|i|s1:^c,s2:^c||g
strcpy|*c|dst:*c,src:^c||g
strcspn|m|s:^c,charset:^c||g
strerror|*c|errnum:i||g
strftime|z|s:*c,maxsize:z,format:^c,timeptr:^@struct tm;||5
strlen|m|s:^c||g
strncat|*c|s1:*c,s2:^c,n:z||g
strncmp|i|s1:^c,s2:^c,n:z||g
strncpy|*c|dst:*c,src:^c,n:z||g
strpbrk|*c|s:^c,charset:^c||g
strptime|*c|buf:^c,format:^c,tm:*@struct tm;||5
strrchr|*c|s:^c,c:i||g
strspn|m|s:^c,charset:^c||g
strstr|*c|big:^c,little:^c||g
strtod|d|nptr:^c,endptr:**c||2
strtof|f|nptr:^c,endptr:**c||2
strtoimax|j|nptr:^c,endptr:**c,base:i||a
strtok|*c|str:*c,sep:^c||g
strtol|l|str:^c,endptr:**c,base:i||2
strtold|e|nptr:^c,endptr:**c||2
strtoll|q|str:^c,endptr:**c,base:i||2
strtoul|m|str:^c,endptr:**c,base:i||2
strtoull|r|str:^c,endptr:**c,base:i||2
strtoumax|k|nptr:^c,endptr:**c,base:i||a
strxfrm|m|s1:*c,s2:^c,n:z||g
swprintf|i|dest:*w,maxlen:z,format:^w|v|6
swscanf|i|src:^w,format:^w|v|6
system|i|command:^c||2
tan|d|x:d||3
tanf|f|x:f||3
tanh|d|x:d||3
tanhf|f|x:f||3
tanhl|e|x:e||3
tanl|e|x:e||3
tgamma|d|x:d||3
tgammaf|f|x:f||3
tgammal|e|x:e||3
time|$time_t;|tloc:*$time_t;||5
timespec_get|i|ts:*@struct timespec;,base:i||5
tmpfile|*@FILE;|||7
tmpnam|*c|s:*c||7
toascii|i|c:i||b
tolower|i|c:i||b
toupper|i|c:i||b
towctrans|$wint_t;|a1:$wint_t;,a2:i||d
towlower|$wint_t;|wc:$wint_t;||c
towupper|$wint_t;|wc:$wint_t;||c
trunc|d|x:d||3
truncf|f|x:f||3
truncl|e|x:e||3
ungetc|i|c:i,stream:*@FILE;||7
ungetwc|$wint_t;|ch:$wint_t;,file:*@FILE;||6
uselocale|&locale_t;|a1:&locale_t;||8
vfprintf|i|file:*@FILE;,format:^c,arg_list:x||7
vfwprintf|i|file:*@FILE;,format:^w,arg_list:x||6
vprintf|i|format:^c,arg_list:x||7
vsprintf|i|dest:*c,format:^c,args:x||7
vswprintf|i|dest:*w,maxlen:z,format:^w,args:x||6
vwprintf|i|format:^w,arg_list:x||6
wcrtomb|z|s:*c,wc:w,ps:*@__mbstate_t;||6
wcscat|*w|dst:*w,src:^w||6
wcschr|*i|s:^w,c:w||6
wcscmp|i|s1:^w,s2:^w||6
wcscoll|i|str1:^w,str2:^w||6
wcscpy|*w|dst:*w,src:^w||6
wcscspn|z|str:^w,control:^w||6
wcsftime|z|buf:*w,maxlen:z,format:^w,tm:^@struct tm;||6
wcslen|m|s:^w||6
wcsncat|*w|dst:*w,src:^w,n:z||6
wcsncmp|i|s1:^w,s2:^w,n:z||6
wcsncpy|*w|dst:*w,src:^w,n:z||6
wcspbrk|*w|str:^w,control:^w||6
wcsrchr|*w|s:^w,c:w||6
wcsrtombs|z|dest:*c,psource:*^w,len:z,state:*@__mbstate_t;||6
wcsspn|z|str:^w,control:^w||6
wcsstr|*w|str:^w,sub_str:^w||6
wcstod|d|str:^w,end_ptr:**w||6
wcstoimax|j|nptr:^w,endptr:**w,base:i||a
wcstok|*w|str:*w,delim:^w,ptr:**w||6
wcstol|l|str:^w,end_ptr:**w,radix:i||6
wcstombs|z|s:*c,pwcs:^w,n:z||2
wcstoul|m|str:^w,end_ptr:**w,radix:i||6
wcstoumax|k|nptr:^w,endptr:**w,base:i||a
wcswidth|i|a1:^w,n:z||6
wcsxfrm|z|dst:*w,src:^w,n:z||6
wctob|i|c:$wint_t;||6
wctomb|i|s:*c,wc:w||2
wctrans|i|a1:^c||d
wctype|$wctype_t;|a1:^c||c
wcwidth|i|a1:w||6
wmemchr|*i|s:^w,c:w,n:z||6
wmemcmp|i|s1:^w,s2:^w,n:z||6
wmemcpy|*i|dst:*w,src:^w,n:z||6
wmemmove|*i|dst:*w,src:^w,n:z||6
wmemset|*w|s:*w,c:w,n:z||6
wprintf|i|format:^w|v|6
wscanf|i|format:^w|v|6
=_CurrentRuneLocale|*@_RuneLocale;||l
=daylight|i||5
=getdate_err|i||5
=timezone|l||5
`;var Sr=Object.freeze({__proto__:null,data:hr,headers:Cr,provenance:fr});const gr="macOS SDK 27.0 CoreFoundation.framework",Er=["Headers/CFDate.h","Headers/CFBase.h","Headers/CFArray.h","Headers/CFAttributedString.h","Headers/CFBag.h","Headers/CFBinaryHeap.h","Headers/CFBitVector.h","Headers/CFNumber.h","Headers/CFBundle.h","Headers/CFCalendar.h","Headers/CFCharacterSet.h","Headers/CFUtilities.h","Headers/CFData.h","Headers/CFDateFormatter.h","Headers/CFDictionary.h","Headers/CFError.h","Headers/CFFileDescriptor.h","Headers/CFFileSecurity.h","Headers/CFLocale.h","Headers/CFMachPort.h","Headers/CFMessagePort.h","Headers/CFNotificationCenter.h","Headers/CFNumberFormatter.h","Headers/CFPlugIn.h","Headers/CFPreferences.h","Headers/CFPropertyList.h","Headers/CFStream.h","Headers/CFRunLoop.h","Headers/CFSet.h","Headers/CFString.h","Headers/CFSocket.h","Headers/CFStringTokenizer.h","Headers/CFTimeZone.h","Headers/CFTree.h","Headers/CFURL.h","Headers/CFURLAccess.h","Headers/CFURLEnumerator.h","Headers/CFUUID.h","Headers/CFUserNotification.h","Headers/CFXMLParser.h","Headers/CFXMLNode.h"],Fr=`&CFAllocatorRef=@struct __CFAllocator;
&CFArrayRef=@struct __CFArray;
&CFAttributedStringRef=@struct __CFAttributedString;
&CFBagRef=@struct __CFBag;
&CFBinaryHeapRef=@struct __CFBinaryHeap;
&CFBitVectorRef=@struct __CFBitVector;
&CFBooleanRef=@struct __CFBoolean;
&CFBundleRef=@struct __CFBundle;
&CFCalendarRef=@struct __CFCalendar;
&CFCharacterSetRef=@struct __CFCharacterSet;
&CFDataRef=@struct __CFData;
&CFDateFormatterRef=@struct __CFDateFormatter;
&CFDateRef=@struct __CFDate;
&CFDictionaryRef=@struct __CFDictionary;
&CFErrorRef=@struct __CFError;
&CFFileDescriptorRef=@struct __CFFileDescriptor;
&CFFileSecurityRef=@struct __CFFileSecurity;
&CFLocaleRef=@struct __CFLocale;
&CFMachPortRef=@struct __CFMachPort;
&CFMessagePortRef=@struct __CFMessagePort;
&CFMutableArrayRef=@struct __CFArray;
&CFMutableAttributedStringRef=@struct __CFAttributedString;
&CFMutableBagRef=@struct __CFBag;
&CFMutableBitVectorRef=@struct __CFBitVector;
&CFMutableCharacterSetRef=@struct __CFCharacterSet;
&CFMutableDataRef=@struct __CFData;
&CFMutableDictionaryRef=@struct __CFDictionary;
&CFMutableSetRef=@struct __CFSet;
&CFMutableStringRef=@struct __CFString;
&CFNotificationCenterRef=@struct __CFNotificationCenter;
&CFNullRef=@struct __CFNull;
&CFNumberFormatterRef=@struct __CFNumberFormatter;
&CFNumberRef=@struct __CFNumber;
&CFPlugInInstanceRef=@struct __CFPlugInInstance;
&CFPlugInRef=@struct __CFBundle;
&CFReadStreamRef=@struct __CFReadStream;
&CFRunLoopObserverRef=@struct __CFRunLoopObserver;
&CFRunLoopRef=@struct __CFRunLoop;
&CFRunLoopSourceRef=@struct __CFRunLoopSource;
&CFRunLoopTimerRef=@struct __CFRunLoopTimer;
&CFSetRef=@struct __CFSet;
&CFSocketRef=@struct __CFSocket;
&CFStringRef=@struct __CFString;
&CFStringTokenizerRef=@struct __CFStringTokenizer;
&CFTimeZoneRef=@struct __CFTimeZone;
&CFTreeRef=@struct __CFTree;
&CFTypeRef=v
&CFURLEnumeratorRef=@struct __CFURLEnumerator;
&CFURLRef=@struct __CFURL;
&CFUUIDRef=@struct __CFUUID;
&CFUserNotificationRef=@struct __CFUserNotification;
&CFWriteStreamRef=@struct __CFWriteStream;
&CFXMLNodeRef=@struct __CFXMLNode;
&CFXMLParserRef=@struct __CFXMLParser;
&acl_t=@struct _acl;
&dispatch_queue_t=@struct dispatch_queue_s;
CFAbsoluteTimeGetCurrent|d|||0
CFAbsoluteTimeGetDayOfWeek|i|at:d,tz:&CFTimeZoneRef;||0
CFAbsoluteTimeGetDayOfYear|i|at:d,tz:&CFTimeZoneRef;||0
CFAbsoluteTimeGetWeekOfYear|i|at:d,tz:&CFTimeZoneRef;||0
CFAllocatorAllocate|*v|allocator:&CFAllocatorRef;,size:l,hint:m||1
CFAllocatorAllocateBytes|*v|allocator:&CFAllocatorRef;,size:l,hint:m||1
CFAllocatorAllocateTyped|*v|allocator:&CFAllocatorRef;,size:l,descriptor:r,hint:m||1
CFAllocatorCreate|&CFAllocatorRef;|allocator:&CFAllocatorRef;,context:*@CFAllocatorContext;||1
CFAllocatorCreateWithZone|&CFAllocatorRef;|allocator:&CFAllocatorRef;,zone:*@struct _malloc_zone_t;||1
CFAllocatorDeallocate|v|allocator:&CFAllocatorRef;,ptr:*v||1
CFAllocatorGetContext|v|allocator:&CFAllocatorRef;,context:*@CFAllocatorContext;||1
CFAllocatorGetDefault|&CFAllocatorRef;|||1
CFAllocatorGetPreferredSizeForSize|l|allocator:&CFAllocatorRef;,size:l,hint:m||1
CFAllocatorGetTypeID|m|||1
CFAllocatorReallocate|*v|allocator:&CFAllocatorRef;,ptr:*v,newsize:l,hint:m||1
CFAllocatorReallocateBytes|*v|allocator:&CFAllocatorRef;,ptr:*v,newsize:l,hint:m||1
CFAllocatorReallocateTyped|*v|allocator:&CFAllocatorRef;,ptr:*v,newsize:l,descriptor:r,hint:m||1
CFAllocatorSetDefault|v|allocator:&CFAllocatorRef;||1
CFArrayAppendValue|v|theArray:&CFMutableArrayRef;,value:^v||2
CFArrayCreate|&CFArrayRef;|allocator:&CFAllocatorRef;,values:*^v,numValues:l,callBacks:^@CFArrayCallBacks;||2
CFArrayCreateCopy|&CFArrayRef;|allocator:&CFAllocatorRef;,theArray:&CFArrayRef;||2
CFArrayCreateMutable|&CFMutableArrayRef;|allocator:&CFAllocatorRef;,capacity:l,callBacks:^@CFArrayCallBacks;||2
CFArrayCreateMutableCopy|&CFMutableArrayRef;|allocator:&CFAllocatorRef;,capacity:l,theArray:&CFArrayRef;||2
CFArrayExchangeValuesAtIndices|v|theArray:&CFMutableArrayRef;,idx1:l,idx2:l||2
CFArrayGetCount|l|theArray:&CFArrayRef;||2
CFArrayGetTypeID|m|||2
CFArrayGetValueAtIndex|^v|theArray:&CFArrayRef;,idx:l||2
CFArrayInsertValueAtIndex|v|theArray:&CFMutableArrayRef;,idx:l,value:^v||2
CFArrayRemoveAllValues|v|theArray:&CFMutableArrayRef;||2
CFArrayRemoveValueAtIndex|v|theArray:&CFMutableArrayRef;,idx:l||2
CFArraySetValueAtIndex|v|theArray:&CFMutableArrayRef;,idx:l,value:^v||2
CFAttributedStringBeginEditing|v|aStr:&CFMutableAttributedStringRef;||3
CFAttributedStringCreate|&CFAttributedStringRef;|alloc:&CFAllocatorRef;,str:&CFStringRef;,attributes:&CFDictionaryRef;||3
CFAttributedStringCreateCopy|&CFAttributedStringRef;|alloc:&CFAllocatorRef;,aStr:&CFAttributedStringRef;||3
CFAttributedStringCreateMutable|&CFMutableAttributedStringRef;|alloc:&CFAllocatorRef;,maxLength:l||3
CFAttributedStringCreateMutableCopy|&CFMutableAttributedStringRef;|alloc:&CFAllocatorRef;,maxLength:l,aStr:&CFAttributedStringRef;||3
CFAttributedStringEndEditing|v|aStr:&CFMutableAttributedStringRef;||3
CFAttributedStringGetAttribute|&CFTypeRef;|aStr:&CFAttributedStringRef;,loc:l,attrName:&CFStringRef;,effectiveRange:*@CFRange;||3
CFAttributedStringGetAttributes|&CFDictionaryRef;|aStr:&CFAttributedStringRef;,loc:l,effectiveRange:*@CFRange;||3
CFAttributedStringGetLength|l|aStr:&CFAttributedStringRef;||3
CFAttributedStringGetMutableString|&CFMutableStringRef;|aStr:&CFMutableAttributedStringRef;||3
CFAttributedStringGetString|&CFStringRef;|aStr:&CFAttributedStringRef;||3
CFAttributedStringGetTypeID|m|||3
CFAutorelease|&CFTypeRef;|arg:&CFTypeRef;||1
CFBagAddValue|v|theBag:&CFMutableBagRef;,value:^v||4
CFBagApplyFunction|v|theBag:&CFBagRef;,applier:p,context:*v||4
CFBagContainsValue|h|theBag:&CFBagRef;,value:^v||4
CFBagCreate|&CFBagRef;|allocator:&CFAllocatorRef;,values:*^v,numValues:l,callBacks:^@CFBagCallBacks;||4
CFBagCreateCopy|&CFBagRef;|allocator:&CFAllocatorRef;,theBag:&CFBagRef;||4
CFBagCreateMutable|&CFMutableBagRef;|allocator:&CFAllocatorRef;,capacity:l,callBacks:^@CFBagCallBacks;||4
CFBagCreateMutableCopy|&CFMutableBagRef;|allocator:&CFAllocatorRef;,capacity:l,theBag:&CFBagRef;||4
CFBagGetCount|l|theBag:&CFBagRef;||4
CFBagGetCountOfValue|l|theBag:&CFBagRef;,value:^v||4
CFBagGetTypeID|m|||4
CFBagGetValue|^v|theBag:&CFBagRef;,value:^v||4
CFBagGetValueIfPresent|h|theBag:&CFBagRef;,candidate:^v,value:*^v||4
CFBagGetValues|v|theBag:&CFBagRef;,values:*^v||4
CFBagRemoveAllValues|v|theBag:&CFMutableBagRef;||4
CFBagRemoveValue|v|theBag:&CFMutableBagRef;,value:^v||4
CFBagReplaceValue|v|theBag:&CFMutableBagRef;,value:^v||4
CFBagSetValue|v|theBag:&CFMutableBagRef;,value:^v||4
CFBinaryHeapAddValue|v|heap:&CFBinaryHeapRef;,value:^v||5
CFBinaryHeapApplyFunction|v|heap:&CFBinaryHeapRef;,applier:p,context:*v||5
CFBinaryHeapContainsValue|h|heap:&CFBinaryHeapRef;,value:^v||5
CFBinaryHeapCreate|&CFBinaryHeapRef;|allocator:&CFAllocatorRef;,capacity:l,callBacks:^@CFBinaryHeapCallBacks;,compareContext:^@CFBinaryHeapCompareContext;||5
CFBinaryHeapCreateCopy|&CFBinaryHeapRef;|allocator:&CFAllocatorRef;,capacity:l,heap:&CFBinaryHeapRef;||5
CFBinaryHeapGetCount|l|heap:&CFBinaryHeapRef;||5
CFBinaryHeapGetCountOfValue|l|heap:&CFBinaryHeapRef;,value:^v||5
CFBinaryHeapGetMinimum|^v|heap:&CFBinaryHeapRef;||5
CFBinaryHeapGetMinimumIfPresent|h|heap:&CFBinaryHeapRef;,value:*^v||5
CFBinaryHeapGetTypeID|m|||5
CFBinaryHeapGetValues|v|heap:&CFBinaryHeapRef;,values:*^v||5
CFBinaryHeapRemoveAllValues|v|heap:&CFBinaryHeapRef;||5
CFBinaryHeapRemoveMinimumValue|v|heap:&CFBinaryHeapRef;||5
CFBitVectorCreate|&CFBitVectorRef;|allocator:&CFAllocatorRef;,bytes:^h,numBits:l||6
CFBitVectorCreateCopy|&CFBitVectorRef;|allocator:&CFAllocatorRef;,bv:&CFBitVectorRef;||6
CFBitVectorCreateMutable|&CFMutableBitVectorRef;|allocator:&CFAllocatorRef;,capacity:l||6
CFBitVectorCreateMutableCopy|&CFMutableBitVectorRef;|allocator:&CFAllocatorRef;,capacity:l,bv:&CFBitVectorRef;||6
CFBitVectorFlipBitAtIndex|v|bv:&CFMutableBitVectorRef;,idx:l||6
CFBitVectorGetBitAtIndex|u|bv:&CFBitVectorRef;,idx:l||6
CFBitVectorGetCount|l|bv:&CFBitVectorRef;||6
CFBitVectorGetTypeID|m|||6
CFBitVectorSetAllBits|v|bv:&CFMutableBitVectorRef;,value:u||6
CFBitVectorSetBitAtIndex|v|bv:&CFMutableBitVectorRef;,idx:l,value:u||6
CFBitVectorSetCount|v|bv:&CFMutableBitVectorRef;,count:l||6
CFBooleanGetTypeID|m|||7
CFBooleanGetValue|h|boolean:&CFBooleanRef;||7
CFBundleCloseBundleResourceMap|v|bundle:&CFBundleRef;,refNum:i||8
CFBundleCopyAuxiliaryExecutableURL|&CFURLRef;|bundle:&CFBundleRef;,executableName:&CFStringRef;||8
CFBundleCopyBuiltInPlugInsURL|&CFURLRef;|bundle:&CFBundleRef;||8
CFBundleCopyBundleLocalizations|&CFArrayRef;|bundle:&CFBundleRef;||8
CFBundleCopyBundleURL|&CFURLRef;|bundle:&CFBundleRef;||8
CFBundleCopyExecutableArchitectures|&CFArrayRef;|bundle:&CFBundleRef;||8
CFBundleCopyExecutableArchitecturesForURL|&CFArrayRef;|url:&CFURLRef;||8
CFBundleCopyExecutableURL|&CFURLRef;|bundle:&CFBundleRef;||8
CFBundleCopyInfoDictionaryForURL|&CFDictionaryRef;|url:&CFURLRef;||8
CFBundleCopyInfoDictionaryInDirectory|&CFDictionaryRef;|bundleURL:&CFURLRef;||8
CFBundleCopyLocalizationsForPreferences|&CFArrayRef;|locArray:&CFArrayRef;,prefArray:&CFArrayRef;||8
CFBundleCopyLocalizationsForURL|&CFArrayRef;|url:&CFURLRef;||8
CFBundleCopyLocalizedString|&CFStringRef;|bundle:&CFBundleRef;,key:&CFStringRef;,value:&CFStringRef;,tableName:&CFStringRef;||8
CFBundleCopyLocalizedStringForLocalizations|&CFStringRef;|bundle:&CFBundleRef;,key:&CFStringRef;,value:&CFStringRef;,tableName:&CFStringRef;,localizations:&CFArrayRef;||8
CFBundleCopyPreferredLocalizationsFromArray|&CFArrayRef;|locArray:&CFArrayRef;||8
CFBundleCopyPrivateFrameworksURL|&CFURLRef;|bundle:&CFBundleRef;||8
CFBundleCopyResourceURL|&CFURLRef;|bundle:&CFBundleRef;,resourceName:&CFStringRef;,resourceType:&CFStringRef;,subDirName:&CFStringRef;||8
CFBundleCopyResourceURLForLocalization|&CFURLRef;|bundle:&CFBundleRef;,resourceName:&CFStringRef;,resourceType:&CFStringRef;,subDirName:&CFStringRef;,localizationName:&CFStringRef;||8
CFBundleCopyResourceURLInDirectory|&CFURLRef;|bundleURL:&CFURLRef;,resourceName:&CFStringRef;,resourceType:&CFStringRef;,subDirName:&CFStringRef;||8
CFBundleCopyResourceURLsOfType|&CFArrayRef;|bundle:&CFBundleRef;,resourceType:&CFStringRef;,subDirName:&CFStringRef;||8
CFBundleCopyResourceURLsOfTypeForLocalization|&CFArrayRef;|bundle:&CFBundleRef;,resourceType:&CFStringRef;,subDirName:&CFStringRef;,localizationName:&CFStringRef;||8
CFBundleCopyResourceURLsOfTypeInDirectory|&CFArrayRef;|bundleURL:&CFURLRef;,resourceType:&CFStringRef;,subDirName:&CFStringRef;||8
CFBundleCopyResourcesDirectoryURL|&CFURLRef;|bundle:&CFBundleRef;||8
CFBundleCopySharedFrameworksURL|&CFURLRef;|bundle:&CFBundleRef;||8
CFBundleCopySharedSupportURL|&CFURLRef;|bundle:&CFBundleRef;||8
CFBundleCopySupportFilesDirectoryURL|&CFURLRef;|bundle:&CFBundleRef;||8
CFBundleCreate|&CFBundleRef;|allocator:&CFAllocatorRef;,bundleURL:&CFURLRef;||8
CFBundleCreateBundlesFromDirectory|&CFArrayRef;|allocator:&CFAllocatorRef;,directoryURL:&CFURLRef;,bundleType:&CFStringRef;||8
CFBundleGetAllBundles|&CFArrayRef;|||8
CFBundleGetBundleWithIdentifier|&CFBundleRef;|bundleID:&CFStringRef;||8
CFBundleGetDataPointerForName|*v|bundle:&CFBundleRef;,symbolName:&CFStringRef;||8
CFBundleGetDataPointersForNames|v|bundle:&CFBundleRef;,symbolNames:&CFArrayRef;,stbl:**v||8
CFBundleGetDevelopmentRegion|&CFStringRef;|bundle:&CFBundleRef;||8
CFBundleGetFunctionPointerForName|*v|bundle:&CFBundleRef;,functionName:&CFStringRef;||8
CFBundleGetFunctionPointersForNames|v|bundle:&CFBundleRef;,functionNames:&CFArrayRef;,ftbl:**v||8
CFBundleGetIdentifier|&CFStringRef;|bundle:&CFBundleRef;||8
CFBundleGetInfoDictionary|&CFDictionaryRef;|bundle:&CFBundleRef;||8
CFBundleGetLocalInfoDictionary|&CFDictionaryRef;|bundle:&CFBundleRef;||8
CFBundleGetMainBundle|&CFBundleRef;|||8
CFBundleGetPackageInfo|v|bundle:&CFBundleRef;,packageType:*u,packageCreator:*u||8
CFBundleGetPackageInfoInDirectory|h|url:&CFURLRef;,packageType:*u,packageCreator:*u||8
CFBundleGetPlugIn|&CFPlugInRef;|bundle:&CFBundleRef;||8
CFBundleGetTypeID|m|||8
CFBundleGetValueForInfoDictionaryKey|&CFTypeRef;|bundle:&CFBundleRef;,key:&CFStringRef;||8
CFBundleGetVersionNumber|u|bundle:&CFBundleRef;||8
CFBundleIsArchitectureLoadable|h|arch:i||8
CFBundleIsExecutableLoadable|h|bundle:&CFBundleRef;||8
CFBundleIsExecutableLoadableForURL|h|url:&CFURLRef;||8
CFBundleIsExecutableLoaded|h|bundle:&CFBundleRef;||8
CFBundleLoadExecutable|h|bundle:&CFBundleRef;||8
CFBundleLoadExecutableAndReturnError|h|bundle:&CFBundleRef;,error:*&CFErrorRef;||8
CFBundleOpenBundleResourceFiles|i|bundle:&CFBundleRef;,refNum:*i,localizedRefNum:*i||8
CFBundleOpenBundleResourceMap|i|bundle:&CFBundleRef;||8
CFBundlePreflightExecutable|h|bundle:&CFBundleRef;,error:*&CFErrorRef;||8
CFBundleUnloadExecutable|v|bundle:&CFBundleRef;||8
CFCalendarAddComponents|h|calendar:&CFCalendarRef;,at:*d,options:m,componentDesc:^c|v|9
CFCalendarComposeAbsoluteTime|h|calendar:&CFCalendarRef;,at:*d,componentDesc:^c|v|9
CFCalendarCopyCurrent|&CFCalendarRef;|||9
CFCalendarCopyLocale|&CFLocaleRef;|calendar:&CFCalendarRef;||9
CFCalendarCopyTimeZone|&CFTimeZoneRef;|calendar:&CFCalendarRef;||9
CFCalendarCreateWithIdentifier|&CFCalendarRef;|allocator:&CFAllocatorRef;,identifier:&CFStringRef;||9
CFCalendarDecomposeAbsoluteTime|h|calendar:&CFCalendarRef;,at:d,componentDesc:^c|v|9
CFCalendarGetComponentDifference|h|calendar:&CFCalendarRef;,startingAT:d,resultAT:d,options:m,componentDesc:^c|v|9
CFCalendarGetFirstWeekday|l|calendar:&CFCalendarRef;||9
CFCalendarGetIdentifier|&CFStringRef;|calendar:&CFCalendarRef;||9
CFCalendarGetMinimumDaysInFirstWeek|l|calendar:&CFCalendarRef;||9
CFCalendarGetOrdinalityOfUnit|l|calendar:&CFCalendarRef;,smallerUnit:m,biggerUnit:m,at:d||9
CFCalendarGetTimeRangeOfUnit|h|calendar:&CFCalendarRef;,unit:m,at:d,startp:*d,tip:*d||9
CFCalendarGetTypeID|m|||9
CFCalendarSetFirstWeekday|v|calendar:&CFCalendarRef;,wkdy:l||9
CFCalendarSetLocale|v|calendar:&CFCalendarRef;,locale:&CFLocaleRef;||9
CFCalendarSetMinimumDaysInFirstWeek|v|calendar:&CFCalendarRef;,mwd:l||9
CFCalendarSetTimeZone|v|calendar:&CFCalendarRef;,tz:&CFTimeZoneRef;||9
CFCharacterSetAddCharactersInString|v|theSet:&CFMutableCharacterSetRef;,theString:&CFStringRef;||a
CFCharacterSetCreateBitmapRepresentation|&CFDataRef;|alloc:&CFAllocatorRef;,theSet:&CFCharacterSetRef;||a
CFCharacterSetCreateCopy|&CFCharacterSetRef;|alloc:&CFAllocatorRef;,theSet:&CFCharacterSetRef;||a
CFCharacterSetCreateInvertedSet|&CFCharacterSetRef;|alloc:&CFAllocatorRef;,theSet:&CFCharacterSetRef;||a
CFCharacterSetCreateMutable|&CFMutableCharacterSetRef;|alloc:&CFAllocatorRef;||a
CFCharacterSetCreateMutableCopy|&CFMutableCharacterSetRef;|alloc:&CFAllocatorRef;,theSet:&CFCharacterSetRef;||a
CFCharacterSetCreateWithBitmapRepresentation|&CFCharacterSetRef;|alloc:&CFAllocatorRef;,theData:&CFDataRef;||a
CFCharacterSetCreateWithCharactersInString|&CFCharacterSetRef;|alloc:&CFAllocatorRef;,theString:&CFStringRef;||a
CFCharacterSetGetPredefined|&CFCharacterSetRef;|theSetIdentifier:l||a
CFCharacterSetGetTypeID|m|||a
CFCharacterSetHasMemberInPlane|h|theSet:&CFCharacterSetRef;,thePlane:l||a
CFCharacterSetIntersect|v|theSet:&CFMutableCharacterSetRef;,theOtherSet:&CFCharacterSetRef;||a
CFCharacterSetInvert|v|theSet:&CFMutableCharacterSetRef;||a
CFCharacterSetIsCharacterMember|h|theSet:&CFCharacterSetRef;,theChar:t||a
CFCharacterSetIsLongCharacterMember|h|theSet:&CFCharacterSetRef;,theChar:u||a
CFCharacterSetIsSupersetOfSet|h|theSet:&CFCharacterSetRef;,theOtherset:&CFCharacterSetRef;||a
CFCharacterSetRemoveCharactersInString|v|theSet:&CFMutableCharacterSetRef;,theString:&CFStringRef;||a
CFCharacterSetUnion|v|theSet:&CFMutableCharacterSetRef;,theOtherSet:&CFCharacterSetRef;||a
CFCopyDescription|&CFStringRef;|cf:&CFTypeRef;||1
CFCopyHomeDirectoryURL|&CFURLRef;|||b
CFCopyTypeIDDescription|&CFStringRef;|type_id:m||1
CFDataAppendBytes|v|theData:&CFMutableDataRef;,bytes:^h,length:l||c
CFDataCreate|&CFDataRef;|allocator:&CFAllocatorRef;,bytes:^h,length:l||c
CFDataCreateCopy|&CFDataRef;|allocator:&CFAllocatorRef;,theData:&CFDataRef;||c
CFDataCreateMutable|&CFMutableDataRef;|allocator:&CFAllocatorRef;,capacity:l||c
CFDataCreateMutableCopy|&CFMutableDataRef;|allocator:&CFAllocatorRef;,capacity:l,theData:&CFDataRef;||c
CFDataCreateWithBytesNoCopy|&CFDataRef;|allocator:&CFAllocatorRef;,bytes:^h,length:l,bytesDeallocator:&CFAllocatorRef;||c
CFDataGetBytePtr|^h|theData:&CFDataRef;||c
CFDataGetLength|l|theData:&CFDataRef;||c
CFDataGetMutableBytePtr|*h|theData:&CFMutableDataRef;||c
CFDataGetTypeID|m|||c
CFDataIncreaseLength|v|theData:&CFMutableDataRef;,extraLength:l||c
CFDataSetLength|v|theData:&CFMutableDataRef;,length:l||c
CFDateCompare|l|theDate:&CFDateRef;,otherDate:&CFDateRef;,context:*v||0
CFDateCreate|&CFDateRef;|allocator:&CFAllocatorRef;,at:d||0
CFDateFormatterCopyProperty|&CFTypeRef;|formatter:&CFDateFormatterRef;,key:&CFStringRef;||d
CFDateFormatterCreate|&CFDateFormatterRef;|allocator:&CFAllocatorRef;,locale:&CFLocaleRef;,dateStyle:l,timeStyle:l||d
CFDateFormatterCreateDateFormatFromTemplate|&CFStringRef;|allocator:&CFAllocatorRef;,tmplate:&CFStringRef;,options:m,locale:&CFLocaleRef;||d
CFDateFormatterCreateDateFromString|&CFDateRef;|allocator:&CFAllocatorRef;,formatter:&CFDateFormatterRef;,string:&CFStringRef;,rangep:*@CFRange;||d
CFDateFormatterCreateISO8601Formatter|&CFDateFormatterRef;|allocator:&CFAllocatorRef;,formatOptions:m||d
CFDateFormatterCreateStringWithAbsoluteTime|&CFStringRef;|allocator:&CFAllocatorRef;,formatter:&CFDateFormatterRef;,at:d||d
CFDateFormatterCreateStringWithDate|&CFStringRef;|allocator:&CFAllocatorRef;,formatter:&CFDateFormatterRef;,date:&CFDateRef;||d
CFDateFormatterGetAbsoluteTimeFromString|h|formatter:&CFDateFormatterRef;,string:&CFStringRef;,rangep:*@CFRange;,atp:*d||d
CFDateFormatterGetDateStyle|l|formatter:&CFDateFormatterRef;||d
CFDateFormatterGetFormat|&CFStringRef;|formatter:&CFDateFormatterRef;||d
CFDateFormatterGetLocale|&CFLocaleRef;|formatter:&CFDateFormatterRef;||d
CFDateFormatterGetTimeStyle|l|formatter:&CFDateFormatterRef;||d
CFDateFormatterGetTypeID|m|||d
CFDateFormatterSetFormat|v|formatter:&CFDateFormatterRef;,formatString:&CFStringRef;||d
CFDateFormatterSetProperty|v|formatter:&CFDateFormatterRef;,key:&CFStringRef;,value:&CFTypeRef;||d
CFDateGetAbsoluteTime|d|theDate:&CFDateRef;||0
CFDateGetTimeIntervalSinceDate|d|theDate:&CFDateRef;,otherDate:&CFDateRef;||0
CFDateGetTypeID|m|||0
CFDictionaryAddValue|v|theDict:&CFMutableDictionaryRef;,key:^v,value:^v||e
CFDictionaryApplyFunction|v|theDict:&CFDictionaryRef;,applier:p,context:*v||e
CFDictionaryContainsKey|h|theDict:&CFDictionaryRef;,key:^v||e
CFDictionaryContainsValue|h|theDict:&CFDictionaryRef;,value:^v||e
CFDictionaryCreate|&CFDictionaryRef;|allocator:&CFAllocatorRef;,keys:*^v,values:*^v,numValues:l,keyCallBacks:^@CFDictionaryKeyCallBacks;,valueCallBacks:^@CFDictionaryValueCallBacks;||e
CFDictionaryCreateCopy|&CFDictionaryRef;|allocator:&CFAllocatorRef;,theDict:&CFDictionaryRef;||e
CFDictionaryCreateMutable|&CFMutableDictionaryRef;|allocator:&CFAllocatorRef;,capacity:l,keyCallBacks:^@CFDictionaryKeyCallBacks;,valueCallBacks:^@CFDictionaryValueCallBacks;||e
CFDictionaryCreateMutableCopy|&CFMutableDictionaryRef;|allocator:&CFAllocatorRef;,capacity:l,theDict:&CFDictionaryRef;||e
CFDictionaryGetCount|l|theDict:&CFDictionaryRef;||e
CFDictionaryGetCountOfKey|l|theDict:&CFDictionaryRef;,key:^v||e
CFDictionaryGetCountOfValue|l|theDict:&CFDictionaryRef;,value:^v||e
CFDictionaryGetKeysAndValues|v|theDict:&CFDictionaryRef;,keys:*^v,values:*^v||e
CFDictionaryGetTypeID|m|||e
CFDictionaryGetValue|^v|theDict:&CFDictionaryRef;,key:^v||e
CFDictionaryGetValueIfPresent|h|theDict:&CFDictionaryRef;,key:^v,value:*^v||e
CFDictionaryRemoveAllValues|v|theDict:&CFMutableDictionaryRef;||e
CFDictionaryRemoveValue|v|theDict:&CFMutableDictionaryRef;,key:^v||e
CFDictionaryReplaceValue|v|theDict:&CFMutableDictionaryRef;,key:^v,value:^v||e
CFDictionarySetValue|v|theDict:&CFMutableDictionaryRef;,key:^v,value:^v||e
CFEqual|h|cf1:&CFTypeRef;,cf2:&CFTypeRef;||1
CFErrorCopyDescription|&CFStringRef;|err:&CFErrorRef;||f
CFErrorCopyFailureReason|&CFStringRef;|err:&CFErrorRef;||f
CFErrorCopyRecoverySuggestion|&CFStringRef;|err:&CFErrorRef;||f
CFErrorCopyUserInfo|&CFDictionaryRef;|err:&CFErrorRef;||f
CFErrorCreate|&CFErrorRef;|allocator:&CFAllocatorRef;,domain:&CFStringRef;,code:l,userInfo:&CFDictionaryRef;||f
CFErrorCreateWithUserInfoKeysAndValues|&CFErrorRef;|allocator:&CFAllocatorRef;,domain:&CFStringRef;,code:l,userInfoKeys:^^v,userInfoValues:^^v,numUserInfoValues:l||f
CFErrorGetCode|l|err:&CFErrorRef;||f
CFErrorGetDomain|&CFStringRef;|err:&CFErrorRef;||f
CFErrorGetTypeID|m|||f
CFFileDescriptorCreate|&CFFileDescriptorRef;|allocator:&CFAllocatorRef;,fd:i,closeOnInvalidate:h,callout:p,context:^@CFFileDescriptorContext;||g
CFFileDescriptorCreateRunLoopSource|&CFRunLoopSourceRef;|allocator:&CFAllocatorRef;,f:&CFFileDescriptorRef;,order:l||g
CFFileDescriptorDisableCallBacks|v|f:&CFFileDescriptorRef;,callBackTypes:m||g
CFFileDescriptorEnableCallBacks|v|f:&CFFileDescriptorRef;,callBackTypes:m||g
CFFileDescriptorGetContext|v|f:&CFFileDescriptorRef;,context:*@CFFileDescriptorContext;||g
CFFileDescriptorGetNativeDescriptor|i|f:&CFFileDescriptorRef;||g
CFFileDescriptorGetTypeID|m|||g
CFFileDescriptorInvalidate|v|f:&CFFileDescriptorRef;||g
CFFileDescriptorIsValid|h|f:&CFFileDescriptorRef;||g
CFFileSecurityClearProperties|h|fileSec:&CFFileSecurityRef;,clearPropertyMask:m||h
CFFileSecurityCopyAccessControlList|h|fileSec:&CFFileSecurityRef;,accessControlList:*&acl_t;||h
CFFileSecurityCopyGroupUUID|h|fileSec:&CFFileSecurityRef;,groupUUID:*&CFUUIDRef;||h
CFFileSecurityCopyOwnerUUID|h|fileSec:&CFFileSecurityRef;,ownerUUID:*&CFUUIDRef;||h
CFFileSecurityCreate|&CFFileSecurityRef;|allocator:&CFAllocatorRef;||h
CFFileSecurityCreateCopy|&CFFileSecurityRef;|allocator:&CFAllocatorRef;,fileSec:&CFFileSecurityRef;||h
CFFileSecurityGetGroup|h|fileSec:&CFFileSecurityRef;,group:*u||h
CFFileSecurityGetMode|h|fileSec:&CFFileSecurityRef;,mode:*$mode_t;||h
CFFileSecurityGetOwner|h|fileSec:&CFFileSecurityRef;,owner:*u||h
CFFileSecurityGetTypeID|m|||h
CFFileSecuritySetAccessControlList|h|fileSec:&CFFileSecurityRef;,accessControlList:&acl_t;||h
CFFileSecuritySetGroup|h|fileSec:&CFFileSecurityRef;,group:u||h
CFFileSecuritySetGroupUUID|h|fileSec:&CFFileSecurityRef;,groupUUID:&CFUUIDRef;||h
CFFileSecuritySetMode|h|fileSec:&CFFileSecurityRef;,mode:$mode_t;||h
CFFileSecuritySetOwner|h|fileSec:&CFFileSecurityRef;,owner:u||h
CFFileSecuritySetOwnerUUID|h|fileSec:&CFFileSecurityRef;,ownerUUID:&CFUUIDRef;||h
CFGetAllocator|&CFAllocatorRef;|cf:&CFTypeRef;||1
CFGetRetainCount|l|cf:&CFTypeRef;||1
CFGetTypeID|m|cf:&CFTypeRef;||1
CFHash|m|cf:&CFTypeRef;||1
CFLocaleCopyAvailableLocaleIdentifiers|&CFArrayRef;|||i
CFLocaleCopyCommonISOCurrencyCodes|&CFArrayRef;|||i
CFLocaleCopyCurrent|&CFLocaleRef;|||i
CFLocaleCopyDisplayNameForPropertyValue|&CFStringRef;|displayLocale:&CFLocaleRef;,key:&CFStringRef;,value:&CFStringRef;||i
CFLocaleCopyISOCountryCodes|&CFArrayRef;|||i
CFLocaleCopyISOCurrencyCodes|&CFArrayRef;|||i
CFLocaleCopyISOLanguageCodes|&CFArrayRef;|||i
CFLocaleCopyPreferredLanguages|&CFArrayRef;|||i
CFLocaleCreate|&CFLocaleRef;|allocator:&CFAllocatorRef;,localeIdentifier:&CFStringRef;||i
CFLocaleCreateCanonicalLanguageIdentifierFromString|&CFStringRef;|allocator:&CFAllocatorRef;,localeIdentifier:&CFStringRef;||i
CFLocaleCreateCanonicalLocaleIdentifierFromScriptManagerCodes|&CFStringRef;|allocator:&CFAllocatorRef;,lcode:s,rcode:s||i
CFLocaleCreateCanonicalLocaleIdentifierFromString|&CFStringRef;|allocator:&CFAllocatorRef;,localeIdentifier:&CFStringRef;||i
CFLocaleCreateComponentsFromLocaleIdentifier|&CFDictionaryRef;|allocator:&CFAllocatorRef;,localeID:&CFStringRef;||i
CFLocaleCreateCopy|&CFLocaleRef;|allocator:&CFAllocatorRef;,locale:&CFLocaleRef;||i
CFLocaleCreateLocaleIdentifierFromComponents|&CFStringRef;|allocator:&CFAllocatorRef;,dictionary:&CFDictionaryRef;||i
CFLocaleCreateLocaleIdentifierFromWindowsLocaleCode|&CFStringRef;|allocator:&CFAllocatorRef;,lcid:u||i
CFLocaleGetIdentifier|&CFStringRef;|locale:&CFLocaleRef;||i
CFLocaleGetLanguageCharacterDirection|l|isoLangCode:&CFStringRef;||i
CFLocaleGetLanguageLineDirection|l|isoLangCode:&CFStringRef;||i
CFLocaleGetSystem|&CFLocaleRef;|||i
CFLocaleGetTypeID|m|||i
CFLocaleGetValue|&CFTypeRef;|locale:&CFLocaleRef;,key:&CFStringRef;||i
CFLocaleGetWindowsLocaleCodeFromLocaleIdentifier|u|localeIdentifier:&CFStringRef;||i
CFMachPortCreate|&CFMachPortRef;|allocator:&CFAllocatorRef;,callout:p,context:*@CFMachPortContext;,shouldFreeInfo:*h||j
CFMachPortCreateRunLoopSource|&CFRunLoopSourceRef;|allocator:&CFAllocatorRef;,port:&CFMachPortRef;,order:l||j
CFMachPortCreateWithPort|&CFMachPortRef;|allocator:&CFAllocatorRef;,portNum:u,callout:p,context:*@CFMachPortContext;,shouldFreeInfo:*h||j
CFMachPortGetContext|v|port:&CFMachPortRef;,context:*@CFMachPortContext;||j
CFMachPortGetInvalidationCallBack|p|port:&CFMachPortRef;||j
CFMachPortGetPort|u|port:&CFMachPortRef;||j
CFMachPortGetTypeID|m|||j
CFMachPortInvalidate|v|port:&CFMachPortRef;||j
CFMachPortIsValid|h|port:&CFMachPortRef;||j
CFMachPortSetInvalidationCallBack|v|port:&CFMachPortRef;,callout:p||j
CFMakeCollectable|&CFTypeRef;|cf:&CFTypeRef;||1
CFMessagePortCreateLocal|&CFMessagePortRef;|allocator:&CFAllocatorRef;,name:&CFStringRef;,callout:p,context:*@CFMessagePortContext;,shouldFreeInfo:*h||k
CFMessagePortCreateRemote|&CFMessagePortRef;|allocator:&CFAllocatorRef;,name:&CFStringRef;||k
CFMessagePortCreateRunLoopSource|&CFRunLoopSourceRef;|allocator:&CFAllocatorRef;,local:&CFMessagePortRef;,order:l||k
CFMessagePortGetContext|v|ms:&CFMessagePortRef;,context:*@CFMessagePortContext;||k
CFMessagePortGetInvalidationCallBack|p|ms:&CFMessagePortRef;||k
CFMessagePortGetName|&CFStringRef;|ms:&CFMessagePortRef;||k
CFMessagePortGetTypeID|m|||k
CFMessagePortInvalidate|v|ms:&CFMessagePortRef;||k
CFMessagePortIsRemote|h|ms:&CFMessagePortRef;||k
CFMessagePortIsValid|h|ms:&CFMessagePortRef;||k
CFMessagePortSendRequest|i|remote:&CFMessagePortRef;,msgid:i,data:&CFDataRef;,sendTimeout:d,rcvTimeout:d,replyMode:&CFStringRef;,returnData:*&CFDataRef;||k
CFMessagePortSetDispatchQueue|v|ms:&CFMessagePortRef;,queue:&dispatch_queue_t;||k
CFMessagePortSetInvalidationCallBack|v|ms:&CFMessagePortRef;,callout:p||k
CFMessagePortSetName|h|ms:&CFMessagePortRef;,newName:&CFStringRef;||k
CFNotificationCenterAddObserver|v|center:&CFNotificationCenterRef;,observer:^v,callBack:p,name:&CFStringRef;,object:^v,suspensionBehavior:l||l
CFNotificationCenterGetDarwinNotifyCenter|&CFNotificationCenterRef;|||l
CFNotificationCenterGetDistributedCenter|&CFNotificationCenterRef;|||l
CFNotificationCenterGetLocalCenter|&CFNotificationCenterRef;|||l
CFNotificationCenterGetTypeID|m|||l
CFNotificationCenterPostNotification|v|center:&CFNotificationCenterRef;,name:&CFStringRef;,object:^v,userInfo:&CFDictionaryRef;,deliverImmediately:h||l
CFNotificationCenterPostNotificationWithOptions|v|center:&CFNotificationCenterRef;,name:&CFStringRef;,object:^v,userInfo:&CFDictionaryRef;,options:m||l
CFNotificationCenterRemoveEveryObserver|v|center:&CFNotificationCenterRef;,observer:^v||l
CFNotificationCenterRemoveObserver|v|center:&CFNotificationCenterRef;,observer:^v,name:&CFStringRef;,object:^v||l
CFNullGetTypeID|m|||1
CFNumberCompare|l|number:&CFNumberRef;,otherNumber:&CFNumberRef;,context:*v||7
CFNumberCreate|&CFNumberRef;|allocator:&CFAllocatorRef;,theType:l,valuePtr:^v||7
CFNumberFormatterCopyProperty|&CFTypeRef;|formatter:&CFNumberFormatterRef;,key:&CFStringRef;||m
CFNumberFormatterCreate|&CFNumberFormatterRef;|allocator:&CFAllocatorRef;,locale:&CFLocaleRef;,style:l||m
CFNumberFormatterCreateNumberFromString|&CFNumberRef;|allocator:&CFAllocatorRef;,formatter:&CFNumberFormatterRef;,string:&CFStringRef;,rangep:*@CFRange;,options:m||m
CFNumberFormatterCreateStringWithNumber|&CFStringRef;|allocator:&CFAllocatorRef;,formatter:&CFNumberFormatterRef;,number:&CFNumberRef;||m
CFNumberFormatterCreateStringWithValue|&CFStringRef;|allocator:&CFAllocatorRef;,formatter:&CFNumberFormatterRef;,numberType:l,valuePtr:^v||m
CFNumberFormatterGetDecimalInfoForCurrencyCode|h|currencyCode:&CFStringRef;,defaultFractionDigits:*i,roundingIncrement:*d||m
CFNumberFormatterGetFormat|&CFStringRef;|formatter:&CFNumberFormatterRef;||m
CFNumberFormatterGetLocale|&CFLocaleRef;|formatter:&CFNumberFormatterRef;||m
CFNumberFormatterGetStyle|l|formatter:&CFNumberFormatterRef;||m
CFNumberFormatterGetTypeID|m|||m
CFNumberFormatterGetValueFromString|h|formatter:&CFNumberFormatterRef;,string:&CFStringRef;,rangep:*@CFRange;,numberType:l,valuePtr:*v||m
CFNumberFormatterSetFormat|v|formatter:&CFNumberFormatterRef;,formatString:&CFStringRef;||m
CFNumberFormatterSetProperty|v|formatter:&CFNumberFormatterRef;,key:&CFStringRef;,value:&CFTypeRef;||m
CFNumberGetByteSize|l|number:&CFNumberRef;||7
CFNumberGetType|l|number:&CFNumberRef;||7
CFNumberGetTypeID|m|||7
CFNumberGetValue|h|number:&CFNumberRef;,theType:l,valuePtr:*v||7
CFNumberIsFloatType|h|number:&CFNumberRef;||7
CFPlugInAddInstanceForFactory|v|factoryID:&CFUUIDRef;||n
CFPlugInCreate|&CFPlugInRef;|allocator:&CFAllocatorRef;,plugInURL:&CFURLRef;||n
CFPlugInFindFactoriesForPlugInType|&CFArrayRef;|typeUUID:&CFUUIDRef;||n
CFPlugInFindFactoriesForPlugInTypeInPlugIn|&CFArrayRef;|typeUUID:&CFUUIDRef;,plugIn:&CFPlugInRef;||n
CFPlugInGetBundle|&CFBundleRef;|plugIn:&CFPlugInRef;||n
CFPlugInGetTypeID|m|||n
CFPlugInInstanceCreate|*v|allocator:&CFAllocatorRef;,factoryUUID:&CFUUIDRef;,typeUUID:&CFUUIDRef;||n
CFPlugInInstanceCreateWithInstanceDataSize|&CFPlugInInstanceRef;|allocator:&CFAllocatorRef;,instanceDataSize:l,deallocateInstanceFunction:p,factoryName:&CFStringRef;,getInterfaceFunction:p||n
CFPlugInInstanceGetFactoryName|&CFStringRef;|instance:&CFPlugInInstanceRef;||n
CFPlugInInstanceGetInstanceData|*v|instance:&CFPlugInInstanceRef;||n
CFPlugInInstanceGetInterfaceFunctionTable|h|instance:&CFPlugInInstanceRef;,interfaceName:&CFStringRef;,ftbl:**v||n
CFPlugInInstanceGetTypeID|m|||n
CFPlugInIsLoadOnDemand|h|plugIn:&CFPlugInRef;||n
CFPlugInRegisterFactoryFunction|h|factoryUUID:&CFUUIDRef;,func:p||n
CFPlugInRegisterFactoryFunctionByName|h|factoryUUID:&CFUUIDRef;,plugIn:&CFPlugInRef;,functionName:&CFStringRef;||n
CFPlugInRegisterPlugInType|h|factoryUUID:&CFUUIDRef;,typeUUID:&CFUUIDRef;||n
CFPlugInRemoveInstanceForFactory|v|factoryID:&CFUUIDRef;||n
CFPlugInSetLoadOnDemand|v|plugIn:&CFPlugInRef;,flag:h||n
CFPlugInUnregisterFactory|h|factoryUUID:&CFUUIDRef;||n
CFPlugInUnregisterPlugInType|h|factoryUUID:&CFUUIDRef;,typeUUID:&CFUUIDRef;||n
CFPreferencesAddSuitePreferencesToApp|v|applicationID:&CFStringRef;,suiteID:&CFStringRef;||o
CFPreferencesAppSynchronize|h|applicationID:&CFStringRef;||o
CFPreferencesAppValueIsForced|h|key:&CFStringRef;,applicationID:&CFStringRef;||o
CFPreferencesCopyAppValue|&CFTypeRef;|key:&CFStringRef;,applicationID:&CFStringRef;||o
CFPreferencesCopyApplicationList|&CFArrayRef;|userName:&CFStringRef;,hostName:&CFStringRef;||o
CFPreferencesCopyKeyList|&CFArrayRef;|applicationID:&CFStringRef;,userName:&CFStringRef;,hostName:&CFStringRef;||o
CFPreferencesCopyMultiple|&CFDictionaryRef;|keysToFetch:&CFArrayRef;,applicationID:&CFStringRef;,userName:&CFStringRef;,hostName:&CFStringRef;||o
CFPreferencesCopyValue|&CFTypeRef;|key:&CFStringRef;,applicationID:&CFStringRef;,userName:&CFStringRef;,hostName:&CFStringRef;||o
CFPreferencesGetAppBooleanValue|h|key:&CFStringRef;,applicationID:&CFStringRef;,keyExistsAndHasValidFormat:*h||o
CFPreferencesGetAppIntegerValue|l|key:&CFStringRef;,applicationID:&CFStringRef;,keyExistsAndHasValidFormat:*h||o
CFPreferencesRemoveSuitePreferencesFromApp|v|applicationID:&CFStringRef;,suiteID:&CFStringRef;||o
CFPreferencesSetAppValue|v|key:&CFStringRef;,value:&CFTypeRef;,applicationID:&CFStringRef;||o
CFPreferencesSetMultiple|v|keysToSet:&CFDictionaryRef;,keysToRemove:&CFArrayRef;,applicationID:&CFStringRef;,userName:&CFStringRef;,hostName:&CFStringRef;||o
CFPreferencesSetValue|v|key:&CFStringRef;,value:&CFTypeRef;,applicationID:&CFStringRef;,userName:&CFStringRef;,hostName:&CFStringRef;||o
CFPreferencesSynchronize|h|applicationID:&CFStringRef;,userName:&CFStringRef;,hostName:&CFStringRef;||o
CFPropertyListCreateData|&CFDataRef;|allocator:&CFAllocatorRef;,propertyList:&CFTypeRef;,format:l,options:m,error:*&CFErrorRef;||p
CFPropertyListCreateDeepCopy|&CFTypeRef;|allocator:&CFAllocatorRef;,propertyList:&CFTypeRef;,mutabilityOption:m||p
CFPropertyListCreateFromStream|&CFTypeRef;|allocator:&CFAllocatorRef;,stream:&CFReadStreamRef;,streamLength:l,mutabilityOption:m,format:*l,errorString:*&CFStringRef;||p
CFPropertyListCreateFromXMLData|&CFTypeRef;|allocator:&CFAllocatorRef;,xmlData:&CFDataRef;,mutabilityOption:m,errorString:*&CFStringRef;||p
CFPropertyListCreateWithData|&CFTypeRef;|allocator:&CFAllocatorRef;,data:&CFDataRef;,options:m,format:*l,error:*&CFErrorRef;||p
CFPropertyListCreateWithStream|&CFTypeRef;|allocator:&CFAllocatorRef;,stream:&CFReadStreamRef;,streamLength:l,options:m,format:*l,error:*&CFErrorRef;||p
CFPropertyListCreateXMLData|&CFDataRef;|allocator:&CFAllocatorRef;,propertyList:&CFTypeRef;||p
CFPropertyListIsValid|h|plist:&CFTypeRef;,format:l||p
CFPropertyListWrite|l|propertyList:&CFTypeRef;,stream:&CFWriteStreamRef;,format:l,options:m,error:*&CFErrorRef;||p
CFPropertyListWriteToStream|l|propertyList:&CFTypeRef;,stream:&CFWriteStreamRef;,format:l,errorString:*&CFStringRef;||p
CFReadStreamClose|v|stream:&CFReadStreamRef;||q
CFReadStreamCopyDispatchQueue|&dispatch_queue_t;|stream:&CFReadStreamRef;||q
CFReadStreamCopyError|&CFErrorRef;|stream:&CFReadStreamRef;||q
CFReadStreamCopyProperty|&CFTypeRef;|stream:&CFReadStreamRef;,propertyName:&CFStringRef;||q
CFReadStreamCreateWithBytesNoCopy|&CFReadStreamRef;|alloc:&CFAllocatorRef;,bytes:^h,length:l,bytesDeallocator:&CFAllocatorRef;||q
CFReadStreamCreateWithFile|&CFReadStreamRef;|alloc:&CFAllocatorRef;,fileURL:&CFURLRef;||q
CFReadStreamGetBuffer|^h|stream:&CFReadStreamRef;,maxBytesToRead:l,numBytesRead:*l||q
CFReadStreamGetStatus|l|stream:&CFReadStreamRef;||q
CFReadStreamGetTypeID|m|||q
CFReadStreamHasBytesAvailable|h|stream:&CFReadStreamRef;||q
CFReadStreamOpen|h|stream:&CFReadStreamRef;||q
CFReadStreamRead|l|stream:&CFReadStreamRef;,buffer:*h,bufferLength:l||q
CFReadStreamScheduleWithRunLoop|v|stream:&CFReadStreamRef;,runLoop:&CFRunLoopRef;,runLoopMode:&CFStringRef;||q
CFReadStreamSetClient|h|stream:&CFReadStreamRef;,streamEvents:m,clientCB:p,clientContext:*@CFStreamClientContext;||q
CFReadStreamSetDispatchQueue|v|stream:&CFReadStreamRef;,q:&dispatch_queue_t;||q
CFReadStreamSetProperty|h|stream:&CFReadStreamRef;,propertyName:&CFStringRef;,propertyValue:&CFTypeRef;||q
CFReadStreamUnscheduleFromRunLoop|v|stream:&CFReadStreamRef;,runLoop:&CFRunLoopRef;,runLoopMode:&CFStringRef;||q
CFRelease|v|cf:&CFTypeRef;||1
CFRetain|&CFTypeRef;|cf:&CFTypeRef;||1
CFRunLoopAddCommonMode|v|rl:&CFRunLoopRef;,mode:&CFStringRef;||r
CFRunLoopAddObserver|v|rl:&CFRunLoopRef;,observer:&CFRunLoopObserverRef;,mode:&CFStringRef;||r
CFRunLoopAddSource|v|rl:&CFRunLoopRef;,source:&CFRunLoopSourceRef;,mode:&CFStringRef;||r
CFRunLoopAddTimer|v|rl:&CFRunLoopRef;,timer:&CFRunLoopTimerRef;,mode:&CFStringRef;||r
CFRunLoopContainsObserver|h|rl:&CFRunLoopRef;,observer:&CFRunLoopObserverRef;,mode:&CFStringRef;||r
CFRunLoopContainsSource|h|rl:&CFRunLoopRef;,source:&CFRunLoopSourceRef;,mode:&CFStringRef;||r
CFRunLoopContainsTimer|h|rl:&CFRunLoopRef;,timer:&CFRunLoopTimerRef;,mode:&CFStringRef;||r
CFRunLoopCopyAllModes|&CFArrayRef;|rl:&CFRunLoopRef;||r
CFRunLoopCopyCurrentMode|&CFStringRef;|rl:&CFRunLoopRef;||r
CFRunLoopGetCurrent|&CFRunLoopRef;|||r
CFRunLoopGetMain|&CFRunLoopRef;|||r
CFRunLoopGetNextTimerFireDate|d|rl:&CFRunLoopRef;,mode:&CFStringRef;||r
CFRunLoopGetTypeID|m|||r
CFRunLoopIsWaiting|h|rl:&CFRunLoopRef;||r
CFRunLoopObserverCreate|&CFRunLoopObserverRef;|allocator:&CFAllocatorRef;,activities:m,repeats:h,order:l,callout:p,context:*@CFRunLoopObserverContext;||r
CFRunLoopObserverCreateWithHandler|&CFRunLoopObserverRef;|allocator:&CFAllocatorRef;,activities:m,repeats:h,order:l,block:p||r
CFRunLoopObserverDoesRepeat|h|observer:&CFRunLoopObserverRef;||r
CFRunLoopObserverGetActivities|m|observer:&CFRunLoopObserverRef;||r
CFRunLoopObserverGetContext|v|observer:&CFRunLoopObserverRef;,context:*@CFRunLoopObserverContext;||r
CFRunLoopObserverGetOrder|l|observer:&CFRunLoopObserverRef;||r
CFRunLoopObserverGetTypeID|m|||r
CFRunLoopObserverInvalidate|v|observer:&CFRunLoopObserverRef;||r
CFRunLoopObserverIsValid|h|observer:&CFRunLoopObserverRef;||r
CFRunLoopPerformBlock|v|rl:&CFRunLoopRef;,mode:&CFTypeRef;,block:p||r
CFRunLoopRemoveObserver|v|rl:&CFRunLoopRef;,observer:&CFRunLoopObserverRef;,mode:&CFStringRef;||r
CFRunLoopRemoveSource|v|rl:&CFRunLoopRef;,source:&CFRunLoopSourceRef;,mode:&CFStringRef;||r
CFRunLoopRemoveTimer|v|rl:&CFRunLoopRef;,timer:&CFRunLoopTimerRef;,mode:&CFStringRef;||r
CFRunLoopRun|v|||r
CFRunLoopRunInMode|i|mode:&CFStringRef;,seconds:d,returnAfterSourceHandled:h||r
CFRunLoopSourceCreate|&CFRunLoopSourceRef;|allocator:&CFAllocatorRef;,order:l,context:*@CFRunLoopSourceContext;||r
CFRunLoopSourceGetContext|v|source:&CFRunLoopSourceRef;,context:*@CFRunLoopSourceContext;||r
CFRunLoopSourceGetOrder|l|source:&CFRunLoopSourceRef;||r
CFRunLoopSourceGetTypeID|m|||r
CFRunLoopSourceInvalidate|v|source:&CFRunLoopSourceRef;||r
CFRunLoopSourceIsValid|h|source:&CFRunLoopSourceRef;||r
CFRunLoopSourceSignal|v|source:&CFRunLoopSourceRef;||r
CFRunLoopStop|v|rl:&CFRunLoopRef;||r
CFRunLoopTimerCreate|&CFRunLoopTimerRef;|allocator:&CFAllocatorRef;,fireDate:d,interval:d,flags:m,order:l,callout:p,context:*@CFRunLoopTimerContext;||r
CFRunLoopTimerCreateWithHandler|&CFRunLoopTimerRef;|allocator:&CFAllocatorRef;,fireDate:d,interval:d,flags:m,order:l,block:p||r
CFRunLoopTimerDoesRepeat|h|timer:&CFRunLoopTimerRef;||r
CFRunLoopTimerGetContext|v|timer:&CFRunLoopTimerRef;,context:*@CFRunLoopTimerContext;||r
CFRunLoopTimerGetInterval|d|timer:&CFRunLoopTimerRef;||r
CFRunLoopTimerGetNextFireDate|d|timer:&CFRunLoopTimerRef;||r
CFRunLoopTimerGetOrder|l|timer:&CFRunLoopTimerRef;||r
CFRunLoopTimerGetTolerance|d|timer:&CFRunLoopTimerRef;||r
CFRunLoopTimerGetTypeID|m|||r
CFRunLoopTimerInvalidate|v|timer:&CFRunLoopTimerRef;||r
CFRunLoopTimerIsValid|h|timer:&CFRunLoopTimerRef;||r
CFRunLoopTimerSetNextFireDate|v|timer:&CFRunLoopTimerRef;,fireDate:d||r
CFRunLoopTimerSetTolerance|v|timer:&CFRunLoopTimerRef;,tolerance:d||r
CFRunLoopWakeUp|v|rl:&CFRunLoopRef;||r
CFSetAddValue|v|theSet:&CFMutableSetRef;,value:^v||s
CFSetApplyFunction|v|theSet:&CFSetRef;,applier:p,context:*v||s
CFSetContainsValue|h|theSet:&CFSetRef;,value:^v||s
CFSetCreate|&CFSetRef;|allocator:&CFAllocatorRef;,values:*^v,numValues:l,callBacks:^@CFSetCallBacks;||s
CFSetCreateCopy|&CFSetRef;|allocator:&CFAllocatorRef;,theSet:&CFSetRef;||s
CFSetCreateMutable|&CFMutableSetRef;|allocator:&CFAllocatorRef;,capacity:l,callBacks:^@CFSetCallBacks;||s
CFSetCreateMutableCopy|&CFMutableSetRef;|allocator:&CFAllocatorRef;,capacity:l,theSet:&CFSetRef;||s
CFSetGetCount|l|theSet:&CFSetRef;||s
CFSetGetCountOfValue|l|theSet:&CFSetRef;,value:^v||s
CFSetGetTypeID|m|||s
CFSetGetValue|^v|theSet:&CFSetRef;,value:^v||s
CFSetGetValueIfPresent|h|theSet:&CFSetRef;,candidate:^v,value:*^v||s
CFSetGetValues|v|theSet:&CFSetRef;,values:*^v||s
CFSetRemoveAllValues|v|theSet:&CFMutableSetRef;||s
CFSetRemoveValue|v|theSet:&CFMutableSetRef;,value:^v||s
CFSetReplaceValue|v|theSet:&CFMutableSetRef;,value:^v||s
CFSetSetValue|v|theSet:&CFMutableSetRef;,value:^v||s
CFShow|v|obj:&CFTypeRef;||t
CFShowStr|v|str:&CFStringRef;||t
CFSocketConnectToAddress|l|s:&CFSocketRef;,address:&CFDataRef;,timeout:d||u
CFSocketCopyAddress|&CFDataRef;|s:&CFSocketRef;||u
CFSocketCopyPeerAddress|&CFDataRef;|s:&CFSocketRef;||u
CFSocketCopyRegisteredSocketSignature|l|nameServerSignature:^@CFSocketSignature;,timeout:d,name:&CFStringRef;,signature:*@CFSocketSignature;,nameServerAddress:*&CFDataRef;||u
CFSocketCopyRegisteredValue|l|nameServerSignature:^@CFSocketSignature;,timeout:d,name:&CFStringRef;,value:*&CFTypeRef;,nameServerAddress:*&CFDataRef;||u
CFSocketCreate|&CFSocketRef;|allocator:&CFAllocatorRef;,protocolFamily:i,socketType:i,protocol:i,callBackTypes:m,callout:p,context:^@CFSocketContext;||u
CFSocketCreateConnectedToSocketSignature|&CFSocketRef;|allocator:&CFAllocatorRef;,signature:^@CFSocketSignature;,callBackTypes:m,callout:p,context:^@CFSocketContext;,timeout:d||u
CFSocketCreateRunLoopSource|&CFRunLoopSourceRef;|allocator:&CFAllocatorRef;,s:&CFSocketRef;,order:l||u
CFSocketCreateWithNative|&CFSocketRef;|allocator:&CFAllocatorRef;,sock:i,callBackTypes:m,callout:p,context:^@CFSocketContext;||u
CFSocketCreateWithSocketSignature|&CFSocketRef;|allocator:&CFAllocatorRef;,signature:^@CFSocketSignature;,callBackTypes:m,callout:p,context:^@CFSocketContext;||u
CFSocketDisableCallBacks|v|s:&CFSocketRef;,callBackTypes:m||u
CFSocketEnableCallBacks|v|s:&CFSocketRef;,callBackTypes:m||u
CFSocketGetContext|v|s:&CFSocketRef;,context:*@CFSocketContext;||u
CFSocketGetDefaultNameRegistryPortNumber|t|||u
CFSocketGetNative|i|s:&CFSocketRef;||u
CFSocketGetSocketFlags|m|s:&CFSocketRef;||u
CFSocketGetTypeID|m|||u
CFSocketInvalidate|v|s:&CFSocketRef;||u
CFSocketIsValid|h|s:&CFSocketRef;||u
CFSocketRegisterSocketSignature|l|nameServerSignature:^@CFSocketSignature;,timeout:d,name:&CFStringRef;,signature:^@CFSocketSignature;||u
CFSocketRegisterValue|l|nameServerSignature:^@CFSocketSignature;,timeout:d,name:&CFStringRef;,value:&CFTypeRef;||u
CFSocketSendData|l|s:&CFSocketRef;,address:&CFDataRef;,data:&CFDataRef;,timeout:d||u
CFSocketSetAddress|l|s:&CFSocketRef;,address:&CFDataRef;||u
CFSocketSetDefaultNameRegistryPortNumber|v|port:t||u
CFSocketSetSocketFlags|v|s:&CFSocketRef;,flags:m||u
CFSocketUnregister|l|nameServerSignature:^@CFSocketSignature;,timeout:d,name:&CFStringRef;||u
CFStreamCreateBoundPair|v|alloc:&CFAllocatorRef;,readStream:*&CFReadStreamRef;,writeStream:*&CFWriteStreamRef;,transferBufferSize:l||q
CFStreamCreatePairWithPeerSocketSignature|v|alloc:&CFAllocatorRef;,signature:^@CFSocketSignature;,readStream:*&CFReadStreamRef;,writeStream:*&CFWriteStreamRef;||q
CFStreamCreatePairWithSocket|v|alloc:&CFAllocatorRef;,sock:i,readStream:*&CFReadStreamRef;,writeStream:*&CFWriteStreamRef;||q
CFStreamCreatePairWithSocketToHost|v|alloc:&CFAllocatorRef;,host:&CFStringRef;,port:u,readStream:*&CFReadStreamRef;,writeStream:*&CFWriteStreamRef;||q
CFStringAppend|v|theString:&CFMutableStringRef;,appendedString:&CFStringRef;||t
CFStringAppendCString|v|theString:&CFMutableStringRef;,cStr:^c,encoding:u||t
CFStringAppendCharacters|v|theString:&CFMutableStringRef;,chars:^t,numChars:l||t
CFStringAppendFormat|v|theString:&CFMutableStringRef;,formatOptions:&CFDictionaryRef;,format:&CFStringRef;|v|t
CFStringAppendFormatAndArguments|v|theString:&CFMutableStringRef;,formatOptions:&CFDictionaryRef;,format:&CFStringRef;,arguments:x||t
CFStringAppendPascalString|v|theString:&CFMutableStringRef;,pStr:^h,encoding:u||t
CFStringCapitalize|v|theString:&CFMutableStringRef;,locale:&CFLocaleRef;||t
CFStringCompare|l|theString1:&CFStringRef;,theString2:&CFStringRef;,compareOptions:m||t
CFStringConvertEncodingToIANACharSetName|&CFStringRef;|encoding:u||t
CFStringConvertEncodingToNSStringEncoding|m|encoding:u||t
CFStringConvertEncodingToWindowsCodepage|u|encoding:u||t
CFStringConvertIANACharSetNameToEncoding|u|theString:&CFStringRef;||t
CFStringConvertNSStringEncodingToEncoding|u|encoding:m||t
CFStringConvertWindowsCodepageToEncoding|u|codepage:u||t
CFStringCreateArrayBySeparatingStrings|&CFArrayRef;|alloc:&CFAllocatorRef;,theString:&CFStringRef;,separatorString:&CFStringRef;||t
CFStringCreateByCombiningStrings|&CFStringRef;|alloc:&CFAllocatorRef;,theArray:&CFArrayRef;,separatorString:&CFStringRef;||t
CFStringCreateCopy|&CFStringRef;|alloc:&CFAllocatorRef;,theString:&CFStringRef;||t
CFStringCreateExternalRepresentation|&CFDataRef;|alloc:&CFAllocatorRef;,theString:&CFStringRef;,encoding:u,lossByte:h||t
CFStringCreateFromExternalRepresentation|&CFStringRef;|alloc:&CFAllocatorRef;,data:&CFDataRef;,encoding:u||t
CFStringCreateMutable|&CFMutableStringRef;|alloc:&CFAllocatorRef;,maxLength:l||t
CFStringCreateMutableCopy|&CFMutableStringRef;|alloc:&CFAllocatorRef;,maxLength:l,theString:&CFStringRef;||t
CFStringCreateMutableWithExternalCharactersNoCopy|&CFMutableStringRef;|alloc:&CFAllocatorRef;,chars:*t,numChars:l,capacity:l,externalCharactersAllocator:&CFAllocatorRef;||t
CFStringCreateStringWithValidatedFormat|&CFStringRef;|alloc:&CFAllocatorRef;,formatOptions:&CFDictionaryRef;,validFormatSpecifiers:&CFStringRef;,format:&CFStringRef;,errorPtr:*&CFErrorRef;|v|t
CFStringCreateStringWithValidatedFormatAndArguments|&CFStringRef;|alloc:&CFAllocatorRef;,formatOptions:&CFDictionaryRef;,validFormatSpecifiers:&CFStringRef;,format:&CFStringRef;,arguments:x,errorPtr:*&CFErrorRef;||t
CFStringCreateWithBytes|&CFStringRef;|alloc:&CFAllocatorRef;,bytes:^h,numBytes:l,encoding:u,isExternalRepresentation:h||t
CFStringCreateWithBytesNoCopy|&CFStringRef;|alloc:&CFAllocatorRef;,bytes:^h,numBytes:l,encoding:u,isExternalRepresentation:h,contentsDeallocator:&CFAllocatorRef;||t
CFStringCreateWithCString|&CFStringRef;|alloc:&CFAllocatorRef;,cStr:^c,encoding:u||t
CFStringCreateWithCStringNoCopy|&CFStringRef;|alloc:&CFAllocatorRef;,cStr:^c,encoding:u,contentsDeallocator:&CFAllocatorRef;||t
CFStringCreateWithCharacters|&CFStringRef;|alloc:&CFAllocatorRef;,chars:^t,numChars:l||t
CFStringCreateWithCharactersNoCopy|&CFStringRef;|alloc:&CFAllocatorRef;,chars:^t,numChars:l,contentsDeallocator:&CFAllocatorRef;||t
CFStringCreateWithFileSystemRepresentation|&CFStringRef;|alloc:&CFAllocatorRef;,buffer:^c||t
CFStringCreateWithFormat|&CFStringRef;|alloc:&CFAllocatorRef;,formatOptions:&CFDictionaryRef;,format:&CFStringRef;|v|t
CFStringCreateWithFormatAndArguments|&CFStringRef;|alloc:&CFAllocatorRef;,formatOptions:&CFDictionaryRef;,format:&CFStringRef;,arguments:x||t
CFStringCreateWithPascalString|&CFStringRef;|alloc:&CFAllocatorRef;,pStr:^h,encoding:u||t
CFStringCreateWithPascalStringNoCopy|&CFStringRef;|alloc:&CFAllocatorRef;,pStr:^h,encoding:u,contentsDeallocator:&CFAllocatorRef;||t
CFStringFold|v|theString:&CFMutableStringRef;,theFlags:m,theLocale:&CFLocaleRef;||t
CFStringGetCString|h|theString:&CFStringRef;,buffer:*c,bufferSize:l,encoding:u||t
CFStringGetCStringPtr|^c|theString:&CFStringRef;,encoding:u||t
CFStringGetCharacterAtIndex|t|theString:&CFStringRef;,idx:l||t
CFStringGetCharactersPtr|^t|theString:&CFStringRef;||t
CFStringGetDoubleValue|d|str:&CFStringRef;||t
CFStringGetFastestEncoding|u|theString:&CFStringRef;||t
CFStringGetFileSystemRepresentation|h|string:&CFStringRef;,buffer:*c,maxBufLen:l||t
CFStringGetIntValue|i|str:&CFStringRef;||t
CFStringGetLength|l|theString:&CFStringRef;||t
CFStringGetListOfAvailableEncodings|^u|||t
CFStringGetMaximumSizeForEncoding|l|length:l,encoding:u||t
CFStringGetMaximumSizeOfFileSystemRepresentation|l|string:&CFStringRef;||t
CFStringGetMostCompatibleMacStringEncoding|u|encoding:u||t
CFStringGetNameOfEncoding|&CFStringRef;|encoding:u||t
CFStringGetPascalString|h|theString:&CFStringRef;,buffer:*h,bufferSize:l,encoding:u||t
CFStringGetPascalStringPtr|^h|theString:&CFStringRef;,encoding:u||t
CFStringGetSmallestEncoding|u|theString:&CFStringRef;||t
CFStringGetSystemEncoding|u|||t
CFStringGetTypeID|m|||t
CFStringHasPrefix|h|theString:&CFStringRef;,prefix:&CFStringRef;||t
CFStringHasSuffix|h|theString:&CFStringRef;,suffix:&CFStringRef;||t
CFStringInsert|v|str:&CFMutableStringRef;,idx:l,insertedStr:&CFStringRef;||t
CFStringIsEncodingAvailable|h|encoding:u||t
CFStringIsHyphenationAvailableForLocale|h|locale:&CFLocaleRef;||t
CFStringLowercase|v|theString:&CFMutableStringRef;,locale:&CFLocaleRef;||t
CFStringNormalize|v|theString:&CFMutableStringRef;,theForm:l||t
CFStringPad|v|theString:&CFMutableStringRef;,padString:&CFStringRef;,length:l,indexIntoPad:l||t
CFStringReplaceAll|v|theString:&CFMutableStringRef;,replacement:&CFStringRef;||t
CFStringSetExternalCharactersNoCopy|v|theString:&CFMutableStringRef;,chars:*t,length:l,capacity:l||t
CFStringTokenizerAdvanceToNextToken|m|tokenizer:&CFStringTokenizerRef;||v
CFStringTokenizerCopyCurrentTokenAttribute|&CFTypeRef;|tokenizer:&CFStringTokenizerRef;,attribute:m||v
CFStringTokenizerGetCurrentSubTokens|l|tokenizer:&CFStringTokenizerRef;,ranges:*@CFRange;,maxRangeLength:l,derivedSubTokens:&CFMutableArrayRef;||v
CFStringTokenizerGetTypeID|m|||v
CFStringTokenizerGoToTokenAtIndex|m|tokenizer:&CFStringTokenizerRef;,index:l||v
CFStringTransform|h|string:&CFMutableStringRef;,range:*@CFRange;,transform:&CFStringRef;,reverse:h||t
CFStringTrim|v|theString:&CFMutableStringRef;,trimString:&CFStringRef;||t
CFStringTrimWhitespace|v|theString:&CFMutableStringRef;||t
CFStringUppercase|v|theString:&CFMutableStringRef;,locale:&CFLocaleRef;||t
CFTimeZoneCopyAbbreviation|&CFStringRef;|tz:&CFTimeZoneRef;,at:d||w
CFTimeZoneCopyAbbreviationDictionary|&CFDictionaryRef;|||w
CFTimeZoneCopyDefault|&CFTimeZoneRef;|||w
CFTimeZoneCopyKnownNames|&CFArrayRef;|||w
CFTimeZoneCopyLocalizedName|&CFStringRef;|tz:&CFTimeZoneRef;,style:l,locale:&CFLocaleRef;||w
CFTimeZoneCopySystem|&CFTimeZoneRef;|||w
CFTimeZoneCreate|&CFTimeZoneRef;|allocator:&CFAllocatorRef;,name:&CFStringRef;,data:&CFDataRef;||w
CFTimeZoneCreateWithName|&CFTimeZoneRef;|allocator:&CFAllocatorRef;,name:&CFStringRef;,tryAbbrev:h||w
CFTimeZoneCreateWithTimeIntervalFromGMT|&CFTimeZoneRef;|allocator:&CFAllocatorRef;,ti:d||w
CFTimeZoneGetData|&CFDataRef;|tz:&CFTimeZoneRef;||w
CFTimeZoneGetDaylightSavingTimeOffset|d|tz:&CFTimeZoneRef;,at:d||w
CFTimeZoneGetName|&CFStringRef;|tz:&CFTimeZoneRef;||w
CFTimeZoneGetNextDaylightSavingTimeTransition|d|tz:&CFTimeZoneRef;,at:d||w
CFTimeZoneGetSecondsFromGMT|d|tz:&CFTimeZoneRef;,at:d||w
CFTimeZoneGetTypeID|m|||w
CFTimeZoneIsDaylightSavingTime|h|tz:&CFTimeZoneRef;,at:d||w
CFTimeZoneResetSystem|v|||w
CFTimeZoneSetAbbreviationDictionary|v|dict:&CFDictionaryRef;||w
CFTimeZoneSetDefault|v|tz:&CFTimeZoneRef;||w
CFTreeAppendChild|v|tree:&CFTreeRef;,newChild:&CFTreeRef;||x
CFTreeApplyFunctionToChildren|v|tree:&CFTreeRef;,applier:p,context:*v||x
CFTreeCreate|&CFTreeRef;|allocator:&CFAllocatorRef;,context:^@CFTreeContext;||x
CFTreeFindRoot|&CFTreeRef;|tree:&CFTreeRef;||x
CFTreeGetChildAtIndex|&CFTreeRef;|tree:&CFTreeRef;,idx:l||x
CFTreeGetChildCount|l|tree:&CFTreeRef;||x
CFTreeGetChildren|v|tree:&CFTreeRef;,children:*&CFTreeRef;||x
CFTreeGetContext|v|tree:&CFTreeRef;,context:*@CFTreeContext;||x
CFTreeGetFirstChild|&CFTreeRef;|tree:&CFTreeRef;||x
CFTreeGetNextSibling|&CFTreeRef;|tree:&CFTreeRef;||x
CFTreeGetParent|&CFTreeRef;|tree:&CFTreeRef;||x
CFTreeGetTypeID|m|||x
CFTreeInsertSibling|v|tree:&CFTreeRef;,newSibling:&CFTreeRef;||x
CFTreePrependChild|v|tree:&CFTreeRef;,newChild:&CFTreeRef;||x
CFTreeRemove|v|tree:&CFTreeRef;||x
CFTreeRemoveAllChildren|v|tree:&CFTreeRef;||x
CFTreeSetContext|v|tree:&CFTreeRef;,context:^@CFTreeContext;||x
CFTreeSortChildren|v|tree:&CFTreeRef;,comparator:p,context:*v||x
CFURLCanBeDecomposed|h|anURL:&CFURLRef;||y
CFURLClearResourcePropertyCache|v|url:&CFURLRef;||y
CFURLClearResourcePropertyCacheForKey|v|url:&CFURLRef;,key:&CFStringRef;||y
CFURLCopyAbsoluteURL|&CFURLRef;|relativeURL:&CFURLRef;||y
CFURLCopyFileSystemPath|&CFStringRef;|anURL:&CFURLRef;,pathStyle:l||y
CFURLCopyFragment|&CFStringRef;|anURL:&CFURLRef;,charactersToLeaveEscaped:&CFStringRef;||y
CFURLCopyHostName|&CFStringRef;|anURL:&CFURLRef;||y
CFURLCopyLastPathComponent|&CFStringRef;|url:&CFURLRef;||y
CFURLCopyNetLocation|&CFStringRef;|anURL:&CFURLRef;||y
CFURLCopyParameterString|&CFStringRef;|anURL:&CFURLRef;,charactersToLeaveEscaped:&CFStringRef;||y
CFURLCopyPassword|&CFStringRef;|anURL:&CFURLRef;||y
CFURLCopyPath|&CFStringRef;|anURL:&CFURLRef;||y
CFURLCopyPathExtension|&CFStringRef;|url:&CFURLRef;||y
CFURLCopyQueryString|&CFStringRef;|anURL:&CFURLRef;,charactersToLeaveEscaped:&CFStringRef;||y
CFURLCopyResourcePropertiesForKeys|&CFDictionaryRef;|url:&CFURLRef;,keys:&CFArrayRef;,error:*&CFErrorRef;||y
CFURLCopyResourcePropertyForKey|h|url:&CFURLRef;,key:&CFStringRef;,propertyValueTypeRefPtr:*v,error:*&CFErrorRef;||y
CFURLCopyResourceSpecifier|&CFStringRef;|anURL:&CFURLRef;||y
CFURLCopyScheme|&CFStringRef;|anURL:&CFURLRef;||y
CFURLCopyStrictPath|&CFStringRef;|anURL:&CFURLRef;,isAbsolute:*h||y
CFURLCopyUserName|&CFStringRef;|anURL:&CFURLRef;||y
CFURLCreateAbsoluteURLWithBytes|&CFURLRef;|alloc:&CFAllocatorRef;,relativeURLBytes:^h,length:l,encoding:u,baseURL:&CFURLRef;,useCompatibilityMode:h||y
CFURLCreateBookmarkData|&CFDataRef;|allocator:&CFAllocatorRef;,url:&CFURLRef;,options:m,resourcePropertiesToInclude:&CFArrayRef;,relativeToURL:&CFURLRef;,error:*&CFErrorRef;||y
CFURLCreateBookmarkDataFromAliasRecord|&CFDataRef;|allocatorRef:&CFAllocatorRef;,aliasRecordDataRef:&CFDataRef;||y
CFURLCreateBookmarkDataFromFile|&CFDataRef;|allocator:&CFAllocatorRef;,fileURL:&CFURLRef;,errorRef:*&CFErrorRef;||y
CFURLCreateByResolvingBookmarkData|&CFURLRef;|allocator:&CFAllocatorRef;,bookmark:&CFDataRef;,options:m,relativeToURL:&CFURLRef;,resourcePropertiesToInclude:&CFArrayRef;,isStale:*h,error:*&CFErrorRef;||y
CFURLCreateCopyAppendingPathComponent|&CFURLRef;|allocator:&CFAllocatorRef;,url:&CFURLRef;,pathComponent:&CFStringRef;,isDirectory:h||y
CFURLCreateCopyAppendingPathExtension|&CFURLRef;|allocator:&CFAllocatorRef;,url:&CFURLRef;,extension:&CFStringRef;||y
CFURLCreateCopyDeletingLastPathComponent|&CFURLRef;|allocator:&CFAllocatorRef;,url:&CFURLRef;||y
CFURLCreateCopyDeletingPathExtension|&CFURLRef;|allocator:&CFAllocatorRef;,url:&CFURLRef;||y
CFURLCreateData|&CFDataRef;|allocator:&CFAllocatorRef;,url:&CFURLRef;,encoding:u,escapeWhitespace:h||y
CFURLCreateDataAndPropertiesFromResource|h|alloc:&CFAllocatorRef;,url:&CFURLRef;,resourceData:*&CFDataRef;,properties:*&CFDictionaryRef;,desiredProperties:&CFArrayRef;,errorCode:*i||z
CFURLCreateFilePathURL|&CFURLRef;|allocator:&CFAllocatorRef;,url:&CFURLRef;,error:*&CFErrorRef;||y
CFURLCreateFileReferenceURL|&CFURLRef;|allocator:&CFAllocatorRef;,url:&CFURLRef;,error:*&CFErrorRef;||y
CFURLCreateFromFSRef|&CFURLRef;|allocator:&CFAllocatorRef;,fsRef:^@struct FSRef;||y
CFURLCreateFromFileSystemRepresentation|&CFURLRef;|allocator:&CFAllocatorRef;,buffer:^h,bufLen:l,isDirectory:h||y
CFURLCreateFromFileSystemRepresentationRelativeToBase|&CFURLRef;|allocator:&CFAllocatorRef;,buffer:^h,bufLen:l,isDirectory:h,baseURL:&CFURLRef;||y
CFURLCreatePropertyFromResource|&CFTypeRef;|alloc:&CFAllocatorRef;,url:&CFURLRef;,property:&CFStringRef;,errorCode:*i||z
CFURLCreateResourcePropertiesForKeysFromBookmarkData|&CFDictionaryRef;|allocator:&CFAllocatorRef;,resourcePropertiesToReturn:&CFArrayRef;,bookmark:&CFDataRef;||y
CFURLCreateResourcePropertyForKeyFromBookmarkData|&CFTypeRef;|allocator:&CFAllocatorRef;,resourcePropertyKey:&CFStringRef;,bookmark:&CFDataRef;||y
CFURLCreateStringByAddingPercentEscapes|&CFStringRef;|allocator:&CFAllocatorRef;,originalString:&CFStringRef;,charactersToLeaveUnescaped:&CFStringRef;,legalURLCharactersToBeEscaped:&CFStringRef;,encoding:u||y
CFURLCreateStringByReplacingPercentEscapes|&CFStringRef;|allocator:&CFAllocatorRef;,originalString:&CFStringRef;,charactersToLeaveEscaped:&CFStringRef;||y
CFURLCreateStringByReplacingPercentEscapesUsingEncoding|&CFStringRef;|allocator:&CFAllocatorRef;,origString:&CFStringRef;,charsToLeaveEscaped:&CFStringRef;,encoding:u||y
CFURLCreateWithBytes|&CFURLRef;|allocator:&CFAllocatorRef;,URLBytes:^h,length:l,encoding:u,baseURL:&CFURLRef;||y
CFURLCreateWithFileSystemPath|&CFURLRef;|allocator:&CFAllocatorRef;,filePath:&CFStringRef;,pathStyle:l,isDirectory:h||y
CFURLCreateWithFileSystemPathRelativeToBase|&CFURLRef;|allocator:&CFAllocatorRef;,filePath:&CFStringRef;,pathStyle:l,isDirectory:h,baseURL:&CFURLRef;||y
CFURLCreateWithString|&CFURLRef;|allocator:&CFAllocatorRef;,URLString:&CFStringRef;,baseURL:&CFURLRef;||y
CFURLDestroyResource|h|url:&CFURLRef;,errorCode:*i||z
CFURLEnumeratorCreateForDirectoryURL|&CFURLEnumeratorRef;|alloc:&CFAllocatorRef;,directoryURL:&CFURLRef;,option:m,propertyKeys:&CFArrayRef;||10
CFURLEnumeratorCreateForMountedVolumes|&CFURLEnumeratorRef;|alloc:&CFAllocatorRef;,option:m,propertyKeys:&CFArrayRef;||10
CFURLEnumeratorGetDescendentLevel|l|enumerator:&CFURLEnumeratorRef;||10
CFURLEnumeratorGetNextURL|l|enumerator:&CFURLEnumeratorRef;,url:*&CFURLRef;,error:*&CFErrorRef;||10
CFURLEnumeratorGetSourceDidChange|h|enumerator:&CFURLEnumeratorRef;||10
CFURLEnumeratorGetTypeID|m|||10
CFURLEnumeratorSkipDescendents|v|enumerator:&CFURLEnumeratorRef;||10
CFURLGetBaseURL|&CFURLRef;|anURL:&CFURLRef;||y
CFURLGetBytes|l|url:&CFURLRef;,buffer:*h,bufferLength:l||y
CFURLGetFSRef|h|url:&CFURLRef;,fsRef:*@struct FSRef;||y
CFURLGetFileSystemRepresentation|h|url:&CFURLRef;,resolveAgainstBase:h,buffer:*h,maxBufLen:l||y
CFURLGetPortNumber|i|anURL:&CFURLRef;||y
CFURLGetString|&CFStringRef;|anURL:&CFURLRef;||y
CFURLGetTypeID|m|||y
CFURLHasDirectoryPath|h|anURL:&CFURLRef;||y
CFURLIsFileReferenceURL|h|url:&CFURLRef;||y
CFURLResourceIsReachable|h|url:&CFURLRef;,error:*&CFErrorRef;||y
CFURLSetResourcePropertiesForKeys|h|url:&CFURLRef;,keyedPropertyValues:&CFDictionaryRef;,error:*&CFErrorRef;||y
CFURLSetResourcePropertyForKey|h|url:&CFURLRef;,key:&CFStringRef;,propertyValue:&CFTypeRef;,error:*&CFErrorRef;||y
CFURLSetTemporaryResourcePropertyForKey|v|url:&CFURLRef;,key:&CFStringRef;,propertyValue:&CFTypeRef;||y
CFURLStartAccessingSecurityScopedResource|h|url:&CFURLRef;||y
CFURLStopAccessingSecurityScopedResource|v|url:&CFURLRef;||y
CFURLWriteBookmarkDataToFile|h|bookmarkRef:&CFDataRef;,fileURL:&CFURLRef;,options:m,errorRef:*&CFErrorRef;||y
CFURLWriteDataAndPropertiesToResource|h|url:&CFURLRef;,dataToWrite:&CFDataRef;,propertiesToWrite:&CFDictionaryRef;,errorCode:*i||z
CFUUIDCreate|&CFUUIDRef;|alloc:&CFAllocatorRef;||11
CFUUIDCreateFromString|&CFUUIDRef;|alloc:&CFAllocatorRef;,uuidStr:&CFStringRef;||11
CFUUIDCreateString|&CFStringRef;|alloc:&CFAllocatorRef;,uuid:&CFUUIDRef;||11
CFUUIDCreateWithBytes|&CFUUIDRef;|alloc:&CFAllocatorRef;,byte0:h,byte1:h,byte2:h,byte3:h,byte4:h,byte5:h,byte6:h,byte7:h,byte8:h,byte9:h,byte10:h,byte11:h,byte12:h,byte13:h,byte14:h,byte15:h||11
CFUUIDGetConstantUUIDWithBytes|&CFUUIDRef;|alloc:&CFAllocatorRef;,byte0:h,byte1:h,byte2:h,byte3:h,byte4:h,byte5:h,byte6:h,byte7:h,byte8:h,byte9:h,byte10:h,byte11:h,byte12:h,byte13:h,byte14:h,byte15:h||11
CFUUIDGetTypeID|m|||11
CFUserNotificationCancel|i|userNotification:&CFUserNotificationRef;||12
CFUserNotificationCreate|&CFUserNotificationRef;|allocator:&CFAllocatorRef;,timeout:d,flags:m,error:*i,dictionary:&CFDictionaryRef;||12
CFUserNotificationCreateRunLoopSource|&CFRunLoopSourceRef;|allocator:&CFAllocatorRef;,userNotification:&CFUserNotificationRef;,callout:p,order:l||12
CFUserNotificationDisplayAlert|i|timeout:d,flags:m,iconURL:&CFURLRef;,soundURL:&CFURLRef;,localizationURL:&CFURLRef;,alertHeader:&CFStringRef;,alertMessage:&CFStringRef;,defaultButtonTitle:&CFStringRef;,alternateButtonTitle:&CFStringRef;,otherButtonTitle:&CFStringRef;,responseFlags:*m||12
CFUserNotificationDisplayNotice|i|timeout:d,flags:m,iconURL:&CFURLRef;,soundURL:&CFURLRef;,localizationURL:&CFURLRef;,alertHeader:&CFStringRef;,alertMessage:&CFStringRef;,defaultButtonTitle:&CFStringRef;||12
CFUserNotificationGetResponseDictionary|&CFDictionaryRef;|userNotification:&CFUserNotificationRef;||12
CFUserNotificationGetResponseValue|&CFStringRef;|userNotification:&CFUserNotificationRef;,key:&CFStringRef;,idx:l||12
CFUserNotificationGetTypeID|m|||12
CFUserNotificationReceiveResponse|i|userNotification:&CFUserNotificationRef;,timeout:d,responseFlags:*m||12
CFUserNotificationUpdate|i|userNotification:&CFUserNotificationRef;,timeout:d,flags:m,dictionary:&CFDictionaryRef;||12
CFWriteStreamCanAcceptBytes|h|stream:&CFWriteStreamRef;||q
CFWriteStreamClose|v|stream:&CFWriteStreamRef;||q
CFWriteStreamCopyDispatchQueue|&dispatch_queue_t;|stream:&CFWriteStreamRef;||q
CFWriteStreamCopyError|&CFErrorRef;|stream:&CFWriteStreamRef;||q
CFWriteStreamCopyProperty|&CFTypeRef;|stream:&CFWriteStreamRef;,propertyName:&CFStringRef;||q
CFWriteStreamCreateWithAllocatedBuffers|&CFWriteStreamRef;|alloc:&CFAllocatorRef;,bufferAllocator:&CFAllocatorRef;||q
CFWriteStreamCreateWithBuffer|&CFWriteStreamRef;|alloc:&CFAllocatorRef;,buffer:*h,bufferCapacity:l||q
CFWriteStreamCreateWithFile|&CFWriteStreamRef;|alloc:&CFAllocatorRef;,fileURL:&CFURLRef;||q
CFWriteStreamGetStatus|l|stream:&CFWriteStreamRef;||q
CFWriteStreamGetTypeID|m|||q
CFWriteStreamOpen|h|stream:&CFWriteStreamRef;||q
CFWriteStreamScheduleWithRunLoop|v|stream:&CFWriteStreamRef;,runLoop:&CFRunLoopRef;,runLoopMode:&CFStringRef;||q
CFWriteStreamSetClient|h|stream:&CFWriteStreamRef;,streamEvents:m,clientCB:p,clientContext:*@CFStreamClientContext;||q
CFWriteStreamSetDispatchQueue|v|stream:&CFWriteStreamRef;,q:&dispatch_queue_t;||q
CFWriteStreamSetProperty|h|stream:&CFWriteStreamRef;,propertyName:&CFStringRef;,propertyValue:&CFTypeRef;||q
CFWriteStreamUnscheduleFromRunLoop|v|stream:&CFWriteStreamRef;,runLoop:&CFRunLoopRef;,runLoopMode:&CFStringRef;||q
CFWriteStreamWrite|l|stream:&CFWriteStreamRef;,buffer:^h,bufferLength:l||q
CFXMLCreateStringByEscapingEntities|&CFStringRef;|allocator:&CFAllocatorRef;,string:&CFStringRef;,entitiesDictionary:&CFDictionaryRef;||13
CFXMLCreateStringByUnescapingEntities|&CFStringRef;|allocator:&CFAllocatorRef;,string:&CFStringRef;,entitiesDictionary:&CFDictionaryRef;||13
CFXMLNodeCreate|&CFXMLNodeRef;|alloc:&CFAllocatorRef;,xmlType:l,dataString:&CFStringRef;,additionalInfoPtr:^v,version:l||14
CFXMLNodeCreateCopy|&CFXMLNodeRef;|alloc:&CFAllocatorRef;,origNode:&CFXMLNodeRef;||14
CFXMLNodeGetInfoPtr|^v|node:&CFXMLNodeRef;||14
CFXMLNodeGetString|&CFStringRef;|node:&CFXMLNodeRef;||14
CFXMLNodeGetTypeCode|l|node:&CFXMLNodeRef;||14
CFXMLNodeGetTypeID|m|||14
CFXMLNodeGetVersion|l|node:&CFXMLNodeRef;||14
CFXMLParserAbort|v|parser:&CFXMLParserRef;,errorCode:l,errorDescription:&CFStringRef;||13
CFXMLParserCopyErrorDescription|&CFStringRef;|parser:&CFXMLParserRef;||13
CFXMLParserCreate|&CFXMLParserRef;|allocator:&CFAllocatorRef;,xmlData:&CFDataRef;,dataSource:&CFURLRef;,parseOptions:m,versionOfNodes:l,callBacks:*@CFXMLParserCallBacks;,context:*@CFXMLParserContext;||13
CFXMLParserCreateWithDataFromURL|&CFXMLParserRef;|allocator:&CFAllocatorRef;,dataSource:&CFURLRef;,parseOptions:m,versionOfNodes:l,callBacks:*@CFXMLParserCallBacks;,context:*@CFXMLParserContext;||13
CFXMLParserGetCallBacks|v|parser:&CFXMLParserRef;,callBacks:*@CFXMLParserCallBacks;||13
CFXMLParserGetContext|v|parser:&CFXMLParserRef;,context:*@CFXMLParserContext;||13
CFXMLParserGetDocument|*v|parser:&CFXMLParserRef;||13
CFXMLParserGetLineNumber|l|parser:&CFXMLParserRef;||13
CFXMLParserGetLocation|l|parser:&CFXMLParserRef;||13
CFXMLParserGetSourceURL|&CFURLRef;|parser:&CFXMLParserRef;||13
CFXMLParserGetStatusCode|l|parser:&CFXMLParserRef;||13
CFXMLParserGetTypeID|m|||13
CFXMLParserParse|h|parser:&CFXMLParserRef;||13
CFXMLTreeCreateFromData|&CFTreeRef;|allocator:&CFAllocatorRef;,xmlData:&CFDataRef;,dataSource:&CFURLRef;,parseOptions:m,versionOfNodes:l||13
CFXMLTreeCreateFromDataWithError|&CFTreeRef;|allocator:&CFAllocatorRef;,xmlData:&CFDataRef;,dataSource:&CFURLRef;,parseOptions:m,versionOfNodes:l,errorDict:*&CFDictionaryRef;||13
CFXMLTreeCreateWithDataFromURL|&CFTreeRef;|allocator:&CFAllocatorRef;,dataSource:&CFURLRef;,parseOptions:m,versionOfNodes:l||13
CFXMLTreeCreateWithNode|&CFTreeRef;|allocator:&CFAllocatorRef;,node:&CFXMLNodeRef;||14
CFXMLTreeCreateXMLData|&CFDataRef;|allocator:&CFAllocatorRef;,xmlTree:&CFTreeRef;||13
CFXMLTreeGetNode|&CFXMLNodeRef;|xmlTree:&CFTreeRef;||14
__CFStringMakeConstantString|&CFStringRef;|cStr:^c||t
=kCFAbsoluteTimeIntervalSince1904|d|c|0
=kCFAbsoluteTimeIntervalSince1970|d|c|0
=kCFAllocatorDefault|&CFAllocatorRef;|c|1
=kCFAllocatorMalloc|&CFAllocatorRef;|c|1
=kCFAllocatorMallocZone|&CFAllocatorRef;|c|1
=kCFAllocatorNull|&CFAllocatorRef;|c|1
=kCFAllocatorSystemDefault|&CFAllocatorRef;|c|1
=kCFAllocatorUseContext|&CFAllocatorRef;|c|1
=kCFBanglaCalendar|&CFStringRef;|c|i
=kCFBooleanFalse|&CFBooleanRef;|c|7
=kCFBooleanTrue|&CFBooleanRef;|c|7
=kCFBuddhistCalendar|&CFStringRef;|c|i
=kCFBundleDevelopmentRegionKey|&CFStringRef;|c|8
=kCFBundleExecutableKey|&CFStringRef;|c|8
=kCFBundleIdentifierKey|&CFStringRef;|c|8
=kCFBundleInfoDictionaryVersionKey|&CFStringRef;|c|8
=kCFBundleLocalizationsKey|&CFStringRef;|c|8
=kCFBundleNameKey|&CFStringRef;|c|8
=kCFBundleVersionKey|&CFStringRef;|c|8
=kCFChineseCalendar|&CFStringRef;|c|i
=kCFCoreFoundationVersionNumber|d|c|1
=kCFDangiCalendar|&CFStringRef;|c|i
=kCFDateFormatterAMSymbol|&CFStringRef;|c|d
=kCFDateFormatterCalendar|&CFStringRef;|c|d
=kCFDateFormatterCalendarName|&CFStringRef;|c|d
=kCFDateFormatterDefaultDate|&CFStringRef;|c|d
=kCFDateFormatterDefaultFormat|&CFStringRef;|c|d
=kCFDateFormatterDoesRelativeDateFormattingKey|&CFStringRef;|c|d
=kCFDateFormatterEraSymbols|&CFStringRef;|c|d
=kCFDateFormatterGregorianStartDate|&CFStringRef;|c|d
=kCFDateFormatterIsLenient|&CFStringRef;|c|d
=kCFDateFormatterLongEraSymbols|&CFStringRef;|c|d
=kCFDateFormatterMonthSymbols|&CFStringRef;|c|d
=kCFDateFormatterPMSymbol|&CFStringRef;|c|d
=kCFDateFormatterQuarterSymbols|&CFStringRef;|c|d
=kCFDateFormatterShortMonthSymbols|&CFStringRef;|c|d
=kCFDateFormatterShortQuarterSymbols|&CFStringRef;|c|d
=kCFDateFormatterShortStandaloneMonthSymbols|&CFStringRef;|c|d
=kCFDateFormatterShortStandaloneQuarterSymbols|&CFStringRef;|c|d
=kCFDateFormatterShortStandaloneWeekdaySymbols|&CFStringRef;|c|d
=kCFDateFormatterShortWeekdaySymbols|&CFStringRef;|c|d
=kCFDateFormatterStandaloneMonthSymbols|&CFStringRef;|c|d
=kCFDateFormatterStandaloneQuarterSymbols|&CFStringRef;|c|d
=kCFDateFormatterStandaloneWeekdaySymbols|&CFStringRef;|c|d
=kCFDateFormatterTimeZone|&CFStringRef;|c|d
=kCFDateFormatterTwoDigitStartDate|&CFStringRef;|c|d
=kCFDateFormatterVeryShortMonthSymbols|&CFStringRef;|c|d
=kCFDateFormatterVeryShortStandaloneMonthSymbols|&CFStringRef;|c|d
=kCFDateFormatterVeryShortStandaloneWeekdaySymbols|&CFStringRef;|c|d
=kCFDateFormatterVeryShortWeekdaySymbols|&CFStringRef;|c|d
=kCFDateFormatterWeekdaySymbols|&CFStringRef;|c|d
=kCFErrorDescriptionKey|&CFStringRef;|c|f
=kCFErrorDomainCocoa|&CFStringRef;|c|f
=kCFErrorDomainMach|&CFStringRef;|c|f
=kCFErrorDomainOSStatus|&CFStringRef;|c|f
=kCFErrorDomainPOSIX|&CFStringRef;|c|f
=kCFErrorFilePathKey|&CFStringRef;|c|f
=kCFErrorLocalizedDescriptionKey|&CFStringRef;|c|f
=kCFErrorLocalizedFailureKey|&CFStringRef;|c|f
=kCFErrorLocalizedFailureReasonKey|&CFStringRef;|c|f
=kCFErrorLocalizedRecoverySuggestionKey|&CFStringRef;|c|f
=kCFErrorURLKey|&CFStringRef;|c|f
=kCFErrorUnderlyingErrorKey|&CFStringRef;|c|f
=kCFGregorianCalendar|&CFStringRef;|c|i
=kCFGujaratiCalendar|&CFStringRef;|c|i
=kCFHebrewCalendar|&CFStringRef;|c|i
=kCFISO8601Calendar|&CFStringRef;|c|i
=kCFIndianCalendar|&CFStringRef;|c|i
=kCFIslamicCalendar|&CFStringRef;|c|i
=kCFIslamicCivilCalendar|&CFStringRef;|c|i
=kCFIslamicTabularCalendar|&CFStringRef;|c|i
=kCFIslamicUmmAlQuraCalendar|&CFStringRef;|c|i
=kCFJapaneseCalendar|&CFStringRef;|c|i
=kCFKannadaCalendar|&CFStringRef;|c|i
=kCFLocaleAlternateQuotationBeginDelimiterKey|&CFStringRef;|c|i
=kCFLocaleAlternateQuotationEndDelimiterKey|&CFStringRef;|c|i
=kCFLocaleCalendar|&CFStringRef;|c|i
=kCFLocaleCalendarIdentifier|&CFStringRef;|c|i
=kCFLocaleCollationIdentifier|&CFStringRef;|c|i
=kCFLocaleCollatorIdentifier|&CFStringRef;|c|i
=kCFLocaleCountryCode|&CFStringRef;|c|i
=kCFLocaleCurrencyCode|&CFStringRef;|c|i
=kCFLocaleCurrencySymbol|&CFStringRef;|c|i
=kCFLocaleCurrentLocaleDidChangeNotification|&CFStringRef;|c|i
=kCFLocaleDecimalSeparator|&CFStringRef;|c|i
=kCFLocaleExemplarCharacterSet|&CFStringRef;|c|i
=kCFLocaleGroupingSeparator|&CFStringRef;|c|i
=kCFLocaleIdentifier|&CFStringRef;|c|i
=kCFLocaleLanguageCode|&CFStringRef;|c|i
=kCFLocaleMeasurementSystem|&CFStringRef;|c|i
=kCFLocaleQuotationBeginDelimiterKey|&CFStringRef;|c|i
=kCFLocaleQuotationEndDelimiterKey|&CFStringRef;|c|i
=kCFLocaleScriptCode|&CFStringRef;|c|i
=kCFLocaleUsesMetricSystem|&CFStringRef;|c|i
=kCFLocaleVariantCode|&CFStringRef;|c|i
=kCFMalayalamCalendar|&CFStringRef;|c|i
=kCFMarathiCalendar|&CFStringRef;|c|i
=kCFNull|&CFNullRef;|c|1
=kCFNumberFormatterAlwaysShowDecimalSeparator|&CFStringRef;|c|m
=kCFNumberFormatterCurrencyCode|&CFStringRef;|c|m
=kCFNumberFormatterCurrencyDecimalSeparator|&CFStringRef;|c|m
=kCFNumberFormatterCurrencyGroupingSeparator|&CFStringRef;|c|m
=kCFNumberFormatterCurrencySymbol|&CFStringRef;|c|m
=kCFNumberFormatterDecimalSeparator|&CFStringRef;|c|m
=kCFNumberFormatterDefaultFormat|&CFStringRef;|c|m
=kCFNumberFormatterExponentSymbol|&CFStringRef;|c|m
=kCFNumberFormatterFormatWidth|&CFStringRef;|c|m
=kCFNumberFormatterGroupingSeparator|&CFStringRef;|c|m
=kCFNumberFormatterGroupingSize|&CFStringRef;|c|m
=kCFNumberFormatterInfinitySymbol|&CFStringRef;|c|m
=kCFNumberFormatterInternationalCurrencySymbol|&CFStringRef;|c|m
=kCFNumberFormatterIsLenient|&CFStringRef;|c|m
=kCFNumberFormatterMaxFractionDigits|&CFStringRef;|c|m
=kCFNumberFormatterMaxIntegerDigits|&CFStringRef;|c|m
=kCFNumberFormatterMaxSignificantDigits|&CFStringRef;|c|m
=kCFNumberFormatterMinFractionDigits|&CFStringRef;|c|m
=kCFNumberFormatterMinGroupingDigits|&CFStringRef;|c|m
=kCFNumberFormatterMinIntegerDigits|&CFStringRef;|c|m
=kCFNumberFormatterMinSignificantDigits|&CFStringRef;|c|m
=kCFNumberFormatterMinusSign|&CFStringRef;|c|m
=kCFNumberFormatterMultiplier|&CFStringRef;|c|m
=kCFNumberFormatterNaNSymbol|&CFStringRef;|c|m
=kCFNumberFormatterNegativePrefix|&CFStringRef;|c|m
=kCFNumberFormatterNegativeSuffix|&CFStringRef;|c|m
=kCFNumberFormatterPaddingCharacter|&CFStringRef;|c|m
=kCFNumberFormatterPaddingPosition|&CFStringRef;|c|m
=kCFNumberFormatterPerMillSymbol|&CFStringRef;|c|m
=kCFNumberFormatterPercentSymbol|&CFStringRef;|c|m
=kCFNumberFormatterPlusSign|&CFStringRef;|c|m
=kCFNumberFormatterPositivePrefix|&CFStringRef;|c|m
=kCFNumberFormatterPositiveSuffix|&CFStringRef;|c|m
=kCFNumberFormatterRoundingIncrement|&CFStringRef;|c|m
=kCFNumberFormatterRoundingMode|&CFStringRef;|c|m
=kCFNumberFormatterSecondaryGroupingSize|&CFStringRef;|c|m
=kCFNumberFormatterUseGroupingSeparator|&CFStringRef;|c|m
=kCFNumberFormatterUseSignificantDigits|&CFStringRef;|c|m
=kCFNumberFormatterZeroSymbol|&CFStringRef;|c|m
=kCFNumberNaN|&CFNumberRef;|c|7
=kCFNumberNegativeInfinity|&CFNumberRef;|c|7
=kCFNumberPositiveInfinity|&CFNumberRef;|c|7
=kCFOdiaCalendar|&CFStringRef;|c|i
=kCFPersianCalendar|&CFStringRef;|c|i
=kCFPlugInDynamicRegisterFunctionKey|&CFStringRef;|c|n
=kCFPlugInDynamicRegistrationKey|&CFStringRef;|c|n
=kCFPlugInFactoriesKey|&CFStringRef;|c|n
=kCFPlugInTypesKey|&CFStringRef;|c|n
=kCFPlugInUnloadFunctionKey|&CFStringRef;|c|n
=kCFPreferencesAnyApplication|&CFStringRef;|c|o
=kCFPreferencesAnyHost|&CFStringRef;|c|o
=kCFPreferencesAnyUser|&CFStringRef;|c|o
=kCFPreferencesCurrentApplication|&CFStringRef;|c|o
=kCFPreferencesCurrentHost|&CFStringRef;|c|o
=kCFPreferencesCurrentUser|&CFStringRef;|c|o
=kCFRepublicOfChinaCalendar|&CFStringRef;|c|i
=kCFRunLoopCommonModes|&CFStringRef;|c|r
=kCFRunLoopDefaultMode|&CFStringRef;|c|r
=kCFSocketCommandKey|&CFStringRef;|c|u
=kCFSocketErrorKey|&CFStringRef;|c|u
=kCFSocketNameKey|&CFStringRef;|c|u
=kCFSocketRegisterCommand|&CFStringRef;|c|u
=kCFSocketResultKey|&CFStringRef;|c|u
=kCFSocketRetrieveCommand|&CFStringRef;|c|u
=kCFSocketValueKey|&CFStringRef;|c|u
=kCFStreamErrorDomainSOCKS|i|c|q
=kCFStreamErrorDomainSSL|i|c|q
=kCFStreamPropertyAppendToFile|&CFStringRef;|c|q
=kCFStreamPropertyDataWritten|&CFStringRef;|c|q
=kCFStreamPropertyFileCurrentOffset|&CFStringRef;|c|q
=kCFStreamPropertySocketNativeHandle|&CFStringRef;|c|q
=kCFStreamPropertySocketRemoteHostName|&CFStringRef;|c|q
=kCFStreamPropertySocketRemotePortNumber|&CFStringRef;|c|q
=kCFStringTransformFullwidthHalfwidth|&CFStringRef;|c|t
=kCFStringTransformHiraganaKatakana|&CFStringRef;|c|t
=kCFStringTransformLatinArabic|&CFStringRef;|c|t
=kCFStringTransformLatinCyrillic|&CFStringRef;|c|t
=kCFStringTransformLatinGreek|&CFStringRef;|c|t
=kCFStringTransformLatinHangul|&CFStringRef;|c|t
=kCFStringTransformLatinHebrew|&CFStringRef;|c|t
=kCFStringTransformLatinHiragana|&CFStringRef;|c|t
=kCFStringTransformLatinKatakana|&CFStringRef;|c|t
=kCFStringTransformLatinThai|&CFStringRef;|c|t
=kCFStringTransformMandarinLatin|&CFStringRef;|c|t
=kCFStringTransformStripCombiningMarks|&CFStringRef;|c|t
=kCFStringTransformStripDiacritics|&CFStringRef;|c|t
=kCFStringTransformToLatin|&CFStringRef;|c|t
=kCFStringTransformToUnicodeName|&CFStringRef;|c|t
=kCFStringTransformToXMLHex|&CFStringRef;|c|t
=kCFTamilCalendar|&CFStringRef;|c|i
=kCFTeluguCalendar|&CFStringRef;|c|i
=kCFTimeZoneSystemTimeZoneDidChangeNotification|&CFStringRef;|c|w
=kCFURLAddedToDirectoryDateKey|&CFStringRef;|c|y
=kCFURLApplicationIsScriptableKey|&CFStringRef;|c|y
=kCFURLAttributeModificationDateKey|&CFStringRef;|c|y
=kCFURLCanonicalPathKey|&CFStringRef;|c|y
=kCFURLContentAccessDateKey|&CFStringRef;|c|y
=kCFURLContentModificationDateKey|&CFStringRef;|c|y
=kCFURLCreationDateKey|&CFStringRef;|c|y
=kCFURLCustomIconKey|&CFStringRef;|c|y
=kCFURLDirectoryEntryCountKey|&CFStringRef;|c|y
=kCFURLDocumentIdentifierKey|&CFStringRef;|c|y
=kCFURLEffectiveIconKey|&CFStringRef;|c|y
=kCFURLFileAllocatedSizeKey|&CFStringRef;|c|y
=kCFURLFileContentIdentifierKey|&CFStringRef;|c|y
=kCFURLFileDirectoryContents|&CFStringRef;|c|z
=kCFURLFileExists|&CFStringRef;|c|z
=kCFURLFileIdentifierKey|&CFStringRef;|c|y
=kCFURLFileLastModificationTime|&CFStringRef;|c|z
=kCFURLFileLength|&CFStringRef;|c|z
=kCFURLFileOwnerID|&CFStringRef;|c|z
=kCFURLFilePOSIXMode|&CFStringRef;|c|z
=kCFURLFileProtectionComplete|&CFStringRef;|c|y
=kCFURLFileProtectionCompleteUnlessOpen|&CFStringRef;|c|y
=kCFURLFileProtectionCompleteUntilFirstUserAuthentication|&CFStringRef;|c|y
=kCFURLFileProtectionCompleteWhenUserInactive|&CFStringRef;|c|y
=kCFURLFileProtectionKey|&CFStringRef;|c|y
=kCFURLFileProtectionNone|&CFStringRef;|c|y
=kCFURLFileResourceIdentifierKey|&CFStringRef;|c|y
=kCFURLFileResourceTypeBlockSpecial|&CFStringRef;|c|y
=kCFURLFileResourceTypeCharacterSpecial|&CFStringRef;|c|y
=kCFURLFileResourceTypeDirectory|&CFStringRef;|c|y
=kCFURLFileResourceTypeKey|&CFStringRef;|c|y
=kCFURLFileResourceTypeNamedPipe|&CFStringRef;|c|y
=kCFURLFileResourceTypeRegular|&CFStringRef;|c|y
=kCFURLFileResourceTypeSocket|&CFStringRef;|c|y
=kCFURLFileResourceTypeSymbolicLink|&CFStringRef;|c|y
=kCFURLFileResourceTypeUnknown|&CFStringRef;|c|y
=kCFURLFileSecurityKey|&CFStringRef;|c|y
=kCFURLFileSizeKey|&CFStringRef;|c|y
=kCFURLGenerationIdentifierKey|&CFStringRef;|c|y
=kCFURLHTTPStatusCode|&CFStringRef;|c|z
=kCFURLHTTPStatusLine|&CFStringRef;|c|z
=kCFURLHasHiddenExtensionKey|&CFStringRef;|c|y
=kCFURLIsAliasFileKey|&CFStringRef;|c|y
=kCFURLIsApplicationKey|&CFStringRef;|c|y
=kCFURLIsDirectoryKey|&CFStringRef;|c|y
=kCFURLIsExcludedFromBackupKey|&CFStringRef;|c|y
=kCFURLIsExecutableKey|&CFStringRef;|c|y
=kCFURLIsHiddenKey|&CFStringRef;|c|y
=kCFURLIsMountTriggerKey|&CFStringRef;|c|y
=kCFURLIsPackageKey|&CFStringRef;|c|y
=kCFURLIsPurgeableKey|&CFStringRef;|c|y
=kCFURLIsReadableKey|&CFStringRef;|c|y
=kCFURLIsRegularFileKey|&CFStringRef;|c|y
=kCFURLIsSparseKey|&CFStringRef;|c|y
=kCFURLIsSymbolicLinkKey|&CFStringRef;|c|y
=kCFURLIsSystemImmutableKey|&CFStringRef;|c|y
=kCFURLIsUbiquitousItemKey|&CFStringRef;|c|y
=kCFURLIsUserImmutableKey|&CFStringRef;|c|y
=kCFURLIsVolumeKey|&CFStringRef;|c|y
=kCFURLIsWritableKey|&CFStringRef;|c|y
=kCFURLKeysOfUnsetValuesKey|&CFStringRef;|c|y
=kCFURLLabelColorKey|&CFStringRef;|c|y
=kCFURLLabelNumberKey|&CFStringRef;|c|y
=kCFURLLinkCountKey|&CFStringRef;|c|y
=kCFURLLocalizedLabelKey|&CFStringRef;|c|y
=kCFURLLocalizedNameKey|&CFStringRef;|c|y
=kCFURLLocalizedTypeDescriptionKey|&CFStringRef;|c|y
=kCFURLMayHaveExtendedAttributesKey|&CFStringRef;|c|y
=kCFURLMayShareFileContentKey|&CFStringRef;|c|y
=kCFURLNameKey|&CFStringRef;|c|y
=kCFURLParentDirectoryURLKey|&CFStringRef;|c|y
=kCFURLPathKey|&CFStringRef;|c|y
=kCFURLPreferredIOBlockSizeKey|&CFStringRef;|c|y
=kCFURLQuarantinePropertiesKey|&CFStringRef;|c|y
=kCFURLTagNamesKey|&CFStringRef;|c|y
=kCFURLTotalFileAllocatedSizeKey|&CFStringRef;|c|y
=kCFURLTotalFileSizeKey|&CFStringRef;|c|y
=kCFURLTypeIdentifierKey|&CFStringRef;|c|y
=kCFURLUbiquitousItemDownloadingErrorKey|&CFStringRef;|c|y
=kCFURLUbiquitousItemDownloadingStatusCurrent|&CFStringRef;|c|y
=kCFURLUbiquitousItemDownloadingStatusDownloaded|&CFStringRef;|c|y
=kCFURLUbiquitousItemDownloadingStatusKey|&CFStringRef;|c|y
=kCFURLUbiquitousItemDownloadingStatusNotDownloaded|&CFStringRef;|c|y
=kCFURLUbiquitousItemHasUnresolvedConflictsKey|&CFStringRef;|c|y
=kCFURLUbiquitousItemIsDownloadedKey|&CFStringRef;|c|y
=kCFURLUbiquitousItemIsDownloadingKey|&CFStringRef;|c|y
=kCFURLUbiquitousItemIsExcludedFromSyncKey|&CFStringRef;|c|y
=kCFURLUbiquitousItemIsSyncPausedKey|&CFStringRef;|c|y
=kCFURLUbiquitousItemIsUploadedKey|&CFStringRef;|c|y
=kCFURLUbiquitousItemIsUploadingKey|&CFStringRef;|c|y
=kCFURLUbiquitousItemPercentDownloadedKey|&CFStringRef;|c|y
=kCFURLUbiquitousItemPercentUploadedKey|&CFStringRef;|c|y
=kCFURLUbiquitousItemSupportedSyncControlsKey|&CFStringRef;|c|y
=kCFURLUbiquitousItemUploadingErrorKey|&CFStringRef;|c|y
=kCFURLVolumeAvailableCapacityForImportantUsageKey|&CFStringRef;|c|y
=kCFURLVolumeAvailableCapacityForOpportunisticUsageKey|&CFStringRef;|c|y
=kCFURLVolumeAvailableCapacityKey|&CFStringRef;|c|y
=kCFURLVolumeCreationDateKey|&CFStringRef;|c|y
=kCFURLVolumeIdentifierKey|&CFStringRef;|c|y
=kCFURLVolumeIsAutomountedKey|&CFStringRef;|c|y
=kCFURLVolumeIsBrowsableKey|&CFStringRef;|c|y
=kCFURLVolumeIsEjectableKey|&CFStringRef;|c|y
=kCFURLVolumeIsEncryptedKey|&CFStringRef;|c|y
=kCFURLVolumeIsInternalKey|&CFStringRef;|c|y
=kCFURLVolumeIsJournalingKey|&CFStringRef;|c|y
=kCFURLVolumeIsLocalKey|&CFStringRef;|c|y
=kCFURLVolumeIsReadOnlyKey|&CFStringRef;|c|y
=kCFURLVolumeIsRemovableKey|&CFStringRef;|c|y
=kCFURLVolumeIsRootFileSystemKey|&CFStringRef;|c|y
=kCFURLVolumeLocalizedFormatDescriptionKey|&CFStringRef;|c|y
=kCFURLVolumeLocalizedNameKey|&CFStringRef;|c|y
=kCFURLVolumeMaximumFileSizeKey|&CFStringRef;|c|y
=kCFURLVolumeMountFromLocationKey|&CFStringRef;|c|y
=kCFURLVolumeNameKey|&CFStringRef;|c|y
=kCFURLVolumeResourceCountKey|&CFStringRef;|c|y
=kCFURLVolumeSubtypeKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsAccessPermissionsKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsAdvisoryFileLockingKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsCasePreservedNamesKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsCaseSensitiveNamesKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsCompressionKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsExclusiveRenamingKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsExtendedSecurityKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsFileCloningKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsFileProtectionKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsHardLinksKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsImmutableFilesKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsJournalingKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsPersistentIDsKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsRenamingKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsRootDirectoryDatesKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsSparseFilesKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsSwapRenamingKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsSymbolicLinksKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsVolumeSizesKey|&CFStringRef;|c|y
=kCFURLVolumeSupportsZeroRunsKey|&CFStringRef;|c|y
=kCFURLVolumeTotalCapacityKey|&CFStringRef;|c|y
=kCFURLVolumeTypeNameKey|&CFStringRef;|c|y
=kCFURLVolumeURLForRemountingKey|&CFStringRef;|c|y
=kCFURLVolumeURLKey|&CFStringRef;|c|y
=kCFURLVolumeUUIDStringKey|&CFStringRef;|c|y
=kCFUserNotificationAlertAccessibilityIdentifierKey|&CFStringRef;|c|12
=kCFUserNotificationAlertHeaderKey|&CFStringRef;|c|12
=kCFUserNotificationAlertMessageKey|&CFStringRef;|c|12
=kCFUserNotificationAlertTopMostKey|&CFStringRef;|c|12
=kCFUserNotificationAlternateButtonAccessibilityIdentifierKey|&CFStringRef;|c|12
=kCFUserNotificationAlternateButtonTitleKey|&CFStringRef;|c|12
=kCFUserNotificationCheckBoxTitlesKey|&CFStringRef;|c|12
=kCFUserNotificationDefaultButtonAccessibilityIdentifierKey|&CFStringRef;|c|12
=kCFUserNotificationDefaultButtonTitleKey|&CFStringRef;|c|12
=kCFUserNotificationIconURLKey|&CFStringRef;|c|12
=kCFUserNotificationKeyboardTypesKey|&CFStringRef;|c|12
=kCFUserNotificationLocalizationURLKey|&CFStringRef;|c|12
=kCFUserNotificationOtherButtonAccessibilityIdentifierKey|&CFStringRef;|c|12
=kCFUserNotificationOtherButtonTitleKey|&CFStringRef;|c|12
=kCFUserNotificationPopUpSelectionKey|&CFStringRef;|c|12
=kCFUserNotificationPopUpTitlesKey|&CFStringRef;|c|12
=kCFUserNotificationProgressIndicatorValueKey|&CFStringRef;|c|12
=kCFUserNotificationSoundURLKey|&CFStringRef;|c|12
=kCFUserNotificationTextFieldTitlesKey|&CFStringRef;|c|12
=kCFUserNotificationTextFieldValuesKey|&CFStringRef;|c|12
=kCFVietnameseCalendar|&CFStringRef;|c|i
=kCFVikramCalendar|&CFStringRef;|c|i
=kCFXMLTreeErrorDescription|&CFStringRef;|c|13
=kCFXMLTreeErrorLineNumber|&CFStringRef;|c|13
=kCFXMLTreeErrorLocation|&CFStringRef;|c|13
=kCFXMLTreeErrorStatusCode|&CFStringRef;|c|13
`;var Rr=Object.freeze({__proto__:null,data:Fr,headers:Er,provenance:gr});const Ir="scripts/library-prototypes/cxx-abi.h (Itanium C++ ABI)",Ar=["cxx-abi.h"],wr=`_Unwind_Resume|v|exception_object:*v|n|0
_ZdaPv|v|pointer:*v||0
_ZdaPvRKSt9nothrow_t|v|pointer:*v,nothrow:^v||0
_ZdaPvm|v|pointer:*v,size:z||0
_ZdlPv|v|pointer:*v||0
_ZdlPvRKSt9nothrow_t|v|pointer:*v,nothrow:^v||0
_ZdlPvm|v|pointer:*v,size:z||0
_Znam|*v|size:z||0
_ZnamRKSt9nothrow_t|*v|size:z,nothrow:^v||0
_Znwm|*v|size:z||0
_ZnwmRKSt9nothrow_t|*v|size:z,nothrow:^v||0
__cxa_allocate_dependent_exception|*v|||0
__cxa_allocate_exception|*v|thrown_size:z||0
__cxa_bad_cast|v||n|0
__cxa_bad_typeid|v||n|0
__cxa_begin_catch|*v|exception_object:*v||0
__cxa_call_unexpected|v|exception_object:*v|n|0
__cxa_deleted_virtual|v||n|0
__cxa_demangle|*c|mangled_name:^c,output_buffer:*c,length:*z,status:*i||0
__cxa_end_catch|v|||0
__cxa_free_exception|v|thrown_exception:*v||0
__cxa_get_exception_ptr|*v|exception_object:*v||0
__cxa_guard_abort|v|guard_object:*q||0
__cxa_guard_acquire|i|guard_object:*q||0
__cxa_guard_release|v|guard_object:*q||0
__cxa_pure_virtual|v||n|0
__cxa_throw_bad_array_new_length|v||n|0
__dynamic_cast|*v|src_ptr:^v,src_type:^v,dst_type:^v,src2dst_offset:y||0
__gxx_personality_v0|i|version:i,actions:i,exception_class:r,exception_object:*v,context:*v||0
`;var Tr=Object.freeze({__proto__:null,data:wr,headers:Ar,provenance:Ir});const yr="scripts/library-prototypes (Darwin libSystem checked builtins)",Nr=["CommonCrypto/CommonKeyDerivation.h","CommonCrypto/CommonCryptor.h","CommonCrypto/CommonHMAC.h","CommonCrypto/CommonSymmetricKeywrap.h","CommonCrypto/CommonDigest.h","mach-o/dyld.h","libkern/OSAtomicDeprecated.h","libkern/OSAtomicQueue.h","libkern/OSSpinLockDeprecated.h","_ctype.h","math.h","sys/_types/_fd_def.h","sys/errno.h","iconv.h","darwin-extras.h","dirent.h","signal.h","_stdio.h","mach/mach_host.h","mach/mach_traps.h","mach/mach_vm.h","os/log.h","os/trace.h","unistd.h","mach/thread_act.h","arpa/inet.h","sys/time.h","alloca.h","_stdlib.h","bsm/audit.h","execinfo.h","libgen.h","_strings.h","netinet/in.h","sys/termios.h","sys/stat.h","mach/mach.h","_time.h","mach/clock_priv.h","sys/socket.h","copyfile.h","dispatch/queue.h","dispatch/block.h","dispatch/object.h","dispatch/data.h","dispatch/group.h","dispatch/io.h","dispatch/once.h","dispatch/semaphore.h","dispatch/source.h","dispatch/time.h","dispatch/workloop.h","dlfcn.h","netdb.h","_wchar.h","sys/mount.h","sys/fcntl.h","sys/unistd.h","ifaddrs.h","fts_compat.h","sys/random.h","grp.h","gethostuuid.h","sys/resource.h","getopt.h","pwd.h","mach/host_priv.h","mach/mach_init.h","netinet6/in6.h","sys/ioctl.h","sys/event.h","launch.h","mach/task.h","setjmp.h","mach/mach_time.h","mach/mach_error.h","mach/vm_map.h","mach/message.h","mach/mach_port.h","sys/mman.h","malloc/malloc.h","malloc/_malloc_type.h","_string.h","mach/mig.h","sys/msg.h","_wctype.h","os/object.h","os/lock.h","os/workgroup_object.h","os/workgroup_interval.h","os/workgroup_parallel.h","spawn.h","sys/uio.h","libproc.h","mach/processor.h","mach/processor_set.h","pthread/qos.h","pthread.h","sys/ptrace.h","sys/qos.h","malloc/_malloc.h","_regex.h","sys/stdio.h","mach/semaphore.h","sys/sem.h","sys/shm.h","sys/sysctl.h","uuid/uuid.h","sys/syslog.h","sys/wait.h","xpc/activity.h","xpc/xpc.h","xpc/connection.h","xpc/debug.h","xpc/endpoint.h","xpc/listener.h","xpc/peer_requirement.h","xpc/rich_error.h","xpc/session.h","mach/vm_page_size.h"],vr=`&CCCryptorRef=@struct _CCCryptor;
&NSModule=@struct __NSModule;
&NSObjectFileImage=@struct __NSObjectFileImage;
&NSSymbol=@struct __NSSymbol;
&copyfile_state_t=@struct _copyfile_state;
&dispatch_data_t=@struct dispatch_data_s;
&dispatch_group_t=@struct dispatch_group_s;
&dispatch_io_t=@struct dispatch_io_s;
&dispatch_queue_attr_t=@struct dispatch_queue_attr_s;
&dispatch_queue_t=@struct dispatch_queue_s;
&dispatch_semaphore_t=@struct dispatch_semaphore_s;
&dispatch_source_t=@struct dispatch_source_s;
&dispatch_source_type_t=@struct dispatch_source_type_s;
&dyld_kernel_image_info_array_t=@dyld_kernel_image_info_t;
&exception_handler_info_array_t=@ipc_info_port_t;
&filesec_t=@struct _filesec;
&hash_info_bucket_array_t=@hash_info_bucket_t;
&iconv_t=@struct __tag_iconv_t;
&ipc_info_name_array_t=@ipc_info_name_t;
&ipc_info_tree_name_array_t=@ipc_info_tree_name_t;
&launch_data_t=@struct _launch_data;
&lockgroup_info_array_t=@lockgroup_info_t;
&mach_memory_info_array_t=@mach_memory_info_t;
&mach_port_options_ptr_t=@mach_port_options_t;
&mach_timebase_info_t=@struct mach_timebase_info;
&mach_zone_info_array_t=@mach_zone_info_t;
&mach_zone_name_array_t=@mach_zone_name_t;
&os_log_t=@struct os_log_s;
&os_unfair_lock_t=@struct os_unfair_lock_s;
&os_workgroup_attr_t=@struct os_workgroup_attr_opaque_s;
&os_workgroup_interval_data_t=@struct os_workgroup_interval_data_opaque_s;
&os_workgroup_join_token_t=@struct os_workgroup_join_token_opaque_s;
&os_workgroup_mpt_attr_t=@struct os_workgroup_max_parallel_threads_attr_s;
&os_workgroup_t=@struct os_workgroup_s;
&pthread_override_t=@struct pthread_override_s;
&task_zone_info_array_t=@task_zone_info_t;
&vm_info_object_array_t=@vm_info_object_t;
&voucher_mach_msg_state_t=@struct voucher_mach_msg_state_s;
&xpc_activity_t=@struct _xpc_activity_s;
&xpc_connection_t=@struct _xpc_connection_s;
&xpc_endpoint_t=@struct _xpc_endpoint_s;
&xpc_listener_t=@struct xpc_listener_s;
&xpc_peer_requirement_t=@struct xpc_peer_requirement_s;
&xpc_rich_error_t=@struct _xpc_rich_error_s;
&xpc_session_t=@struct xpc_session_s;
&xpc_type_t=@struct _xpc_type_s;
CCCalibratePBKDF|u|algorithm:u,passwordLen:z,saltLen:z,prf:u,derivedKeyLen:z,msec:u||0
CCCrypt|i|op:u,alg:u,options:u,key:^v,keyLength:z,iv:^v,dataIn:^v,dataInLength:z,dataOut:*v,dataOutAvailable:z,dataOutMoved:*z||1
CCCryptorCreate|i|op:u,alg:u,options:u,key:^v,keyLength:z,iv:^v,cryptorRef:*&CCCryptorRef;||1
CCCryptorCreateFromData|i|op:u,alg:u,options:u,key:^v,keyLength:z,iv:^v,data:^v,dataLength:z,cryptorRef:*&CCCryptorRef;,dataUsed:*z||1
CCCryptorCreateWithMode|i|op:u,mode:u,alg:u,padding:u,iv:^v,key:^v,keyLength:z,tweak:^v,tweakLength:z,numRounds:i,options:u,cryptorRef:*&CCCryptorRef;||1
CCCryptorFinal|i|cryptorRef:&CCCryptorRef;,dataOut:*v,dataOutAvailable:z,dataOutMoved:*z||1
CCCryptorGetOutputLength|z|cryptorRef:&CCCryptorRef;,inputLength:z,final:o||1
CCCryptorRelease|i|cryptorRef:&CCCryptorRef;||1
CCCryptorReset|i|cryptorRef:&CCCryptorRef;,iv:^v||1
CCCryptorUpdate|i|cryptorRef:&CCCryptorRef;,dataIn:^v,dataInLength:z,dataOut:*v,dataOutAvailable:z,dataOutMoved:*z||1
CCHmac|v|algorithm:u,key:^v,keyLength:z,data:^v,dataLength:z,macOut:*v||2
CCHmacFinal|v|ctx:*@CCHmacContext;,macOut:*v||2
CCHmacInit|v|ctx:*@CCHmacContext;,algorithm:u,key:^v,keyLength:z||2
CCHmacUpdate|v|ctx:*@CCHmacContext;,data:^v,dataLength:z||2
CCKeyDerivationPBKDF|i|algorithm:u,password:^c,passwordLen:z,salt:^h,saltLen:z,prf:u,rounds:u,derivedKey:*h,derivedKeyLen:z||0
CCSymmetricKeyUnwrap|i|algorithm:u,iv:^h,ivLen:z,kek:^h,kekLen:z,wrappedKey:^h,wrappedKeyLen:z,rawKey:*h,rawKeyLen:*z||3
CCSymmetricKeyWrap|i|algorithm:u,iv:^h,ivLen:z,kek:^h,kekLen:z,rawKey:^h,rawKeyLen:z,wrappedKey:*h,wrappedKeyLen:*z||3
CCSymmetricUnwrappedSize|z|algorithm:u,wrappedKeyLen:z||3
CCSymmetricWrappedSize|z|algorithm:u,rawKeyLen:z||3
CC_MD2|*h|data:^v,len:u,md:*h||4
CC_MD2_Final|i|md:*h,c:*@CC_MD2_CTX;||4
CC_MD2_Init|i|c:*@CC_MD2_CTX;||4
CC_MD2_Update|i|c:*@CC_MD2_CTX;,data:^v,len:u||4
CC_MD4|*h|data:^v,len:u,md:*h||4
CC_MD4_Final|i|md:*h,c:*@CC_MD4_CTX;||4
CC_MD4_Init|i|c:*@CC_MD4_CTX;||4
CC_MD4_Update|i|c:*@CC_MD4_CTX;,data:^v,len:u||4
CC_MD5|*h|data:^v,len:u,md:*h||4
CC_MD5_Final|i|md:*h,c:*@CC_MD5_CTX;||4
CC_MD5_Init|i|c:*@CC_MD5_CTX;||4
CC_MD5_Update|i|c:*@CC_MD5_CTX;,data:^v,len:u||4
CC_SHA1|*h|data:^v,len:u,md:*h||4
CC_SHA1_Final|i|md:*h,c:*@CC_SHA1_CTX;||4
CC_SHA1_Init|i|c:*@CC_SHA1_CTX;||4
CC_SHA1_Update|i|c:*@CC_SHA1_CTX;,data:^v,len:u||4
CC_SHA224|*h|data:^v,len:u,md:*h||4
CC_SHA224_Final|i|md:*h,c:*@CC_SHA256_CTX;||4
CC_SHA224_Init|i|c:*@CC_SHA256_CTX;||4
CC_SHA224_Update|i|c:*@CC_SHA256_CTX;,data:^v,len:u||4
CC_SHA256|*h|data:^v,len:u,md:*h||4
CC_SHA256_Final|i|md:*h,c:*@CC_SHA256_CTX;||4
CC_SHA256_Init|i|c:*@CC_SHA256_CTX;||4
CC_SHA256_Update|i|c:*@CC_SHA256_CTX;,data:^v,len:u||4
CC_SHA384|*h|data:^v,len:u,md:*h||4
CC_SHA384_Final|i|md:*h,c:*@CC_SHA512_CTX;||4
CC_SHA384_Init|i|c:*@CC_SHA512_CTX;||4
CC_SHA384_Update|i|c:*@CC_SHA512_CTX;,data:^v,len:u||4
CC_SHA512|*h|data:^v,len:u,md:*h||4
CC_SHA512_Final|i|md:*h,c:*@CC_SHA512_CTX;||4
CC_SHA512_Init|i|c:*@CC_SHA512_CTX;||4
CC_SHA512_Update|i|c:*@CC_SHA512_CTX;,data:^v,len:u||4
NSAddImage|^@struct mach_header;|image_name:^c,options:u||5
NSAddLibrary|o|pathName:^c||5
NSAddLibraryWithSearching|o|pathName:^c||5
NSAddressOfSymbol|*v|symbol:&NSSymbol;||5
NSCreateObjectFileImageFromFile|u|pathName:^c,objectFileImage:*&NSObjectFileImage;||5
NSCreateObjectFileImageFromMemory|u|address:^v,size:z,objectFileImage:*&NSObjectFileImage;||5
NSDestroyObjectFileImage|o|objectFileImage:&NSObjectFileImage;||5
NSGetSectionDataInObjectFileImage|*v|objectFileImage:&NSObjectFileImage;,segmentName:^c,sectionName:^c,size:*z||5
NSIsSymbolDefinedInObjectFileImage|o|objectFileImage:&NSObjectFileImage;,symbolName:^c||5
NSIsSymbolNameDefined|o|symbolName:^c||5
NSIsSymbolNameDefinedInImage|o|image:^@struct mach_header;,symbolName:^c||5
NSIsSymbolNameDefinedWithHint|o|symbolName:^c,libraryNameHint:^c||5
NSLibraryNameForModule|^c|m:&NSModule;||5
NSLinkEditError|v|c:*u,errorNumber:*i,fileName:*^c,errorString:*^c||5
NSLinkModule|&NSModule;|objectFileImage:&NSObjectFileImage;,moduleName:^c,options:u||5
NSLookupAndBindSymbol|&NSSymbol;|symbolName:^c||5
NSLookupAndBindSymbolWithHint|&NSSymbol;|symbolName:^c,libraryNameHint:^c||5
NSLookupSymbolInImage|&NSSymbol;|image:^@struct mach_header;,symbolName:^c,options:u||5
NSLookupSymbolInModule|&NSSymbol;|module:&NSModule;,symbolName:^c||5
NSModuleForSymbol|&NSModule;|symbol:&NSSymbol;||5
NSNameOfModule|^c|m:&NSModule;||5
NSUnLinkModule|o|module:&NSModule;,options:u||5
NSVersionOfLinkTimeLibrary|i|libraryName:^c||5
NSVersionOfRunTimeLibrary|i|libraryName:^c||5
OSAtomicAdd32|i|theAmount:i,theValue:*i||6
OSAtomicAdd32Barrier|i|theAmount:i,theValue:*i||6
OSAtomicAdd64|j|theAmount:j,theValue:*j||6
OSAtomicAdd64Barrier|j|theAmount:j,theValue:*j||6
OSAtomicAnd32|i|theMask:u,theValue:*u||6
OSAtomicAnd32Barrier|i|theMask:u,theValue:*u||6
OSAtomicAnd32Orig|i|theMask:u,theValue:*u||6
OSAtomicAnd32OrigBarrier|i|theMask:u,theValue:*u||6
OSAtomicCompareAndSwap32|o|oldValue:i,newValue:i,theValue:*i||6
OSAtomicCompareAndSwap32Barrier|o|oldValue:i,newValue:i,theValue:*i||6
OSAtomicCompareAndSwap64|o|oldValue:j,newValue:j,theValue:*j||6
OSAtomicCompareAndSwap64Barrier|o|oldValue:j,newValue:j,theValue:*j||6
OSAtomicCompareAndSwapInt|o|oldValue:i,newValue:i,theValue:*i||6
OSAtomicCompareAndSwapIntBarrier|o|oldValue:i,newValue:i,theValue:*i||6
OSAtomicCompareAndSwapLong|o|oldValue:l,newValue:l,theValue:*l||6
OSAtomicCompareAndSwapLongBarrier|o|oldValue:l,newValue:l,theValue:*l||6
OSAtomicCompareAndSwapPtr|o|oldValue:*v,newValue:*v,theValue:**v||6
OSAtomicCompareAndSwapPtrBarrier|o|oldValue:*v,newValue:*v,theValue:**v||6
OSAtomicDecrement32|i|theValue:*i||6
OSAtomicDecrement32Barrier|i|theValue:*i||6
OSAtomicDecrement64|j|theValue:*j||6
OSAtomicDecrement64Barrier|j|theValue:*j||6
OSAtomicDequeue|*v|list:*@OSQueueHead;,offset:z||7
OSAtomicEnqueue|v|list:*@OSQueueHead;,new:*v,offset:z||7
OSAtomicFifoDequeue|*v|list:*@OSFifoQueueHead;,offset:z||6
OSAtomicFifoEnqueue|v|list:*@OSFifoQueueHead;,new:*v,offset:z||6
OSAtomicIncrement32|i|theValue:*i||6
OSAtomicIncrement32Barrier|i|theValue:*i||6
OSAtomicIncrement64|j|theValue:*j||6
OSAtomicIncrement64Barrier|j|theValue:*j||6
OSAtomicOr32|i|theMask:u,theValue:*u||6
OSAtomicOr32Barrier|i|theMask:u,theValue:*u||6
OSAtomicOr32Orig|i|theMask:u,theValue:*u||6
OSAtomicOr32OrigBarrier|i|theMask:u,theValue:*u||6
OSAtomicTestAndClear|o|n:u,theAddress:*v||6
OSAtomicTestAndClearBarrier|o|n:u,theAddress:*v||6
OSAtomicTestAndSet|o|n:u,theAddress:*v||6
OSAtomicTestAndSetBarrier|o|n:u,theAddress:*v||6
OSAtomicXor32|i|theMask:u,theValue:*u||6
OSAtomicXor32Barrier|i|theMask:u,theValue:*u||6
OSAtomicXor32Orig|i|theMask:u,theValue:*u||6
OSAtomicXor32OrigBarrier|i|theMask:u,theValue:*u||6
OSMemoryBarrier|v|||6
OSSpinLockLock|v|lock:*i||8
OSSpinLockTry|o|lock:*i||8
OSSpinLockUnlock|v|lock:*i||8
_NSGetExecutablePath|i|buf:*c,bufsize:*u||5
___runetype|m|a1:i||9
___tolower|i|a1:i||9
___toupper|i|a1:i||9
__cospi|d|a1:d||a
__cospif|f|a1:f||a
__darwin_check_fd_set|i|a:i,b:^v||b
__darwin_check_fd_set_overflow|i|a1:i,a2:^v,a3:i||b
__darwin_fd_clr|v|fd:i,p:*@struct fd_set;||b
__darwin_fd_isset|i|fd:i,p:^@struct fd_set;||b
__darwin_fd_set|v|fd:i,p:*@struct fd_set;||b
__error|*i|||c
__exp10|d|a1:d||a
__exp10f|f|a1:f||a
__fpclassifyd|i|a1:d||a
__fpclassifyf|i|a1:f||a
__fpclassifyl|i|a1:e||a
__iconv|z|a1:&iconv_t;,a2:**c,a3:*z,a4:**c,a5:*z,a6:u,a7:*z||d
__iconv_free_list|v|a1:**c,a2:z||d
__iconv_get_list|i|a1:***c,a2:*z,a3:o||d
__inline_isfinited|i|x:d||a
__inline_isfinitef|i|x:f||a
__inline_isfinitel|i|x:e||a
__inline_isinfd|i|x:d||a
__inline_isinff|i|x:f||a
__inline_isinfl|i|x:e||a
__inline_isnand|i|x:d||a
__inline_isnanf|i|x:f||a
__inline_isnanl|i|x:e||a
__inline_isnormald|i|x:d||a
__inline_isnormalf|i|x:f||a
__inline_isnormall|i|x:e||a
__inline_signbitd|i|x:d||a
__inline_signbitf|i|x:f||a
__inline_signbitl|i|x:e||a
__isctype|i|c:i,f:m||9
__istype|i|c:i,f:m||9
__maskrune|i|a1:i,a2:m||9
__math_errhandling|i|||a
__memcpy_chk|*v|dst:*v,src:^v,len:z,dstlen:z||e
__memmove_chk|*v|dst:*v,src:^v,len:z,dstlen:z||e
__memset_chk|*v|dst:*v,c:i,len:z,dstlen:z||e
__opendir2|*@DIR;|a1:^c,a2:i||f
__sigbits|u|signo:i||g
__sincos|v|x:d,sinp:*d,cosp:*d||a
__sincosf|v|x:f,sinp:*f,cosp:*f||a
__sincospi|v|x:d,sinp:*d,cosp:*d||a
__sincospif|v|x:f,sinp:*f,cosp:*f||a
__sinpi|d|a1:d||a
__sinpif|f|a1:f||a
__snprintf_chk|i|s:*c,maxlen:z,flag:i,slen:z,format:^c|vf4|e
__sprintf_chk|i|s:*c,flag:i,slen:z,format:^c|vf3|e
__sputc|i|c:i,p:*@FILE;||h
__srget|i|a1:*@FILE;||h
__stpcpy_chk|*c|dst:*c,src:^c,dstlen:z||e
__stpncpy_chk|*c|dst:*c,src:^c,len:z,dstlen:z||e
__strcat_chk|*c|dst:*c,src:^c,dstlen:z||e
__strcpy_chk|*c|dst:*c,src:^c,dstlen:z||e
__strncat_chk|*c|dst:*c,src:^c,len:z,dstlen:z||e
__strncpy_chk|*c|dst:*c,src:^c,len:z,dstlen:z||e
__svfscanf|i|a1:*@FILE;,a2:^c,a3:x||h
__swbuf|i|a1:i,a2:*@FILE;||h
__tanpi|d|a1:d||a
__tanpif|f|a1:f||a
__tolower|i|a1:i||9
__toupper|i|a1:i||9
__vsnprintf_chk|i|s:*c,maxlen:z,flag:i,slen:z,format:^c,ap:x||e
__vsprintf_chk|i|s:*c,flag:i,slen:z,format:^c,ap:x||e
__wcwidth|i|c:i||9
_dyld_bind_fully_image_containing_address|o|address:^v||5
_dyld_get_dlopen_image_header|^@struct mach_header;|handle:*v||5
_dyld_get_image_header|^@struct mach_header;|image_index:u||5
_dyld_get_image_header_containing_address|^@struct mach_header;|address:^v||5
_dyld_get_image_name|^c|image_index:u||5
_dyld_get_image_vmaddr_slide|y|image_index:u||5
_dyld_image_containing_address|o|address:^v||5
_dyld_image_count|u|||5
_dyld_lookup_and_bind|v|symbol_name:^c,address:**v,module:*&NSModule;||5
_dyld_lookup_and_bind_fully|v|symbol_name:^c,address:**v,module:*&NSModule;||5
_dyld_lookup_and_bind_with_hint|v|symbol_name:^c,library_name_hint:^c,address:**v,module:*&NSModule;||5
_dyld_present|o|||5
_dyld_register_func_for_add_image|v|func:p||5
_dyld_register_func_for_remove_image|v|func:p||5
_dyld_shared_cache_contains_path|o|path:^c||5
_host_page_size|i|host:u,out_page_size:*z||i
_kernelrpc_mach_port_allocate_trap|i|target:u,right:u,name:*u||j
_kernelrpc_mach_port_construct_trap|i|target:u,options:*@mach_port_options_t;,context:k,name:*u||j
_kernelrpc_mach_port_deallocate_trap|i|target:u,name:u||j
_kernelrpc_mach_port_destruct_trap|i|target:u,name:u,srdelta:i,guard:k||j
_kernelrpc_mach_port_extract_member_trap|i|target:u,name:u,pset:u||j
_kernelrpc_mach_port_get_attributes_trap|i|target:u,name:u,flavor:i,port_info_out:*i,port_info_outCnt:*u||j
_kernelrpc_mach_port_guard_trap|i|target:u,name:u,guard:k,strict:i||j
_kernelrpc_mach_port_insert_member_trap|i|target:u,name:u,pset:u||j
_kernelrpc_mach_port_insert_right_trap|i|target:u,name:u,poly:u,polyPoly:u||j
_kernelrpc_mach_port_mod_refs_trap|i|target:u,name:u,right:u,delta:i||j
_kernelrpc_mach_port_move_member_trap|i|target:u,member:u,after:u||j
_kernelrpc_mach_port_request_notification_trap|i|task:u,name:u,msgid:i,sync:u,notify:u,notifyPoly:u,previous:*u||j
_kernelrpc_mach_port_type_trap|i|task:u,name:u,ptype:*u||j
_kernelrpc_mach_port_unguard_trap|i|target:u,name:u,guard:k||j
_kernelrpc_mach_vm_allocate_trap|i|target:u,addr:*k,size:k,flags:i||j
_kernelrpc_mach_vm_deallocate_trap|i|target:u,address:k,size:k||j
_kernelrpc_mach_vm_map_trap|i|target:u,address:*k,size:k,mask:k,flags:i,cur_protection:i||j
_kernelrpc_mach_vm_protect_trap|i|target:u,address:k,size:k,set_maximum:i,new_protection:i||j
_kernelrpc_mach_vm_purgable_control_trap|i|target:u,address:k,control:i,state:*i||j
_mach_make_memory_entry|i|target_task:u,size:*r,offset:r,permission:i,object_handle:*u,parent_handle:u||k
_os_log_create|&os_log_t;|dso:*v,subsystem:^c,category:^c||l
_os_log_debug_impl|v|dso:*v,log:&os_log_t;,type:u,format:^c,buf:*h,size:u||l
_os_log_error_impl|v|dso:*v,log:&os_log_t;,type:u,format:^c,buf:*h,size:u||l
_os_log_fault_impl|v|dso:*v,log:&os_log_t;,type:u,format:^c,buf:*h,size:u||l
_os_log_impl|v|dso:*v,log:&os_log_t;,type:u,format:^c,buf:*h,size:u||l
_os_log_internal|v|dso:*v,log:&os_log_t;,type:u,message:^c|v|l
_os_trace_with_buffer|v|dso:*v,message:^c,type:h,buffer:^v,buffer_size:z,payload:p||m
_tlv_atexit|v|termFunc:p,objAddr:*v||5
_tlv_bootstrap|v|||5
accessx_np|i|a1:^@struct accessx_descriptor;,sz:z,a3:*i,a4:u||n
acct|i|a1:^c||n
act_get_state|i|target_act:u,flavor:i,old_state:*u,old_stateCnt:*u||o
act_set_state|i|target_act:u,flavor:i,new_state:*u,new_stateCnt:u||o
add_profil|i|a1:*c,bufsiz:z,a3:m,a4:u||n
addr2ascii|*c|a1:i,a2:^v,size:i,a4:*c||p
adjtime|i|a1:^@struct timeval;,a2:*@struct timeval;||q
alloca|*v|size:z||r
arc4random|u|||s
arc4random_addrandom|v|a1:*h,datlen:i||s
arc4random_buf|v|buf:*v,nbytes:z||s
arc4random_stir|v|||s
arc4random_uniform|u|upper_bound:u||s
ascii2addr|i|a1:i,a2:^c,a3:*v||p
asprintf|i|strp:**c,fmt:^c|vf1|h
atexit_b|i|block:p||s
audit|i|a1:^v,a2:i||t
audit_session_join|i|port:u||t
audit_session_port|i|asid:i,portname:*u||t
audit_session_self|u|||t
auditctl|i|a1:^c||t
auditon|i|a1:i,a2:*v,a3:i||t
backtrace|i|array:**v,size:i||u
backtrace_async|z|array:**v,length:z,task_id:*u||u
backtrace_from_fp|i|startfp:*v,array:**v,size:i||u
backtrace_image_offsets|v|array:^*v,image_offsets:*@struct image_offset;,size:i||u
backtrace_symbols|**c|array:^*v,size:i||u
backtrace_symbols_fd|v|array:^*v,size:i,fd:i||u
basename_r|*c|a1:^c,a2:*c||v
bcmp|i|s1:^v,s2:^v,n:z||w
bcopy|v|src:^v,dst:*v,n:z||w
bindresvport|i|a1:i,a2:*@struct sockaddr_in;||x
bindresvport_sa|i|a1:i,a2:*@struct sockaddr;||x
brk|*v|a1:^v||n
bsearch_b|*v|key:^v,base:^v,nel:z,width:z,compar:p||s
bzero|v|b:*v,n:z||w
cfmakeraw|v|termios_p:*@struct termios;||y
cfsetspeed|i|termios_p:*@struct termios;,speed:$speed_t;||y
cgetcap|*c|a1:*c,a2:^c,a3:i||s
cgetclose|i|||s
cgetent|i|a1:**c,a2:**c,a3:^c||s
cgetfirst|i|a1:**c,a2:**c||s
cgetmatch|i|a1:^c,a2:^c||s
cgetnext|i|a1:**c,a2:**c||s
cgetnum|i|a1:*c,a2:^c,a3:*l||s
cgetset|i|a1:^c||s
cgetstr|i|a1:*c,a2:^c,a3:**c||s
cgetustr|i|a1:*c,a2:^c,a3:**c||s
chflags|i|a1:^c,a2:u||z
chmodx_np|i|a1:^c,a2:&filesec_t;||z
chroot|i|path:^c||n
clock_get_res|i|a1:u,a2:*i||10
clock_gettime_nsec_np|k|clock_id:u||11
clock_set_attributes|i|clock_ctrl:u,flavor:i,clock_attr:*i,clock_attrCnt:u||12
clock_set_res|i|a1:u,a2:i||10
clock_sleep_trap|i|clock_name:u,sleep_type:i,sleep_sec:i,sleep_nsec:i,wakeup_time:*@mach_timespec_t;||j
connectx|i|a1:i,a2:^@sa_endpoints_t;,a3:u,a4:u,a5:^@struct iovec;,a6:u,a7:*z,a8:*u||13
copyfile|i|from:^c,to:^c,state:&copyfile_state_t;,flags:u||14
copyfile_state_alloc|&copyfile_state_t;|||14
copyfile_state_free|i|a1:&copyfile_state_t;||14
copyfile_state_get|i|s:&copyfile_state_t;,flag:u,dst:*v||14
copyfile_state_set|i|s:&copyfile_state_t;,flag:u,src:^v||14
ctermid_r|*c|a1:*c||h
daemon|i|a1:i,a2:i||s
debug_control_port_for_pid|i|target_tport:u,pid:i,t:*u||j
devname|*c|a1:$dev_t;,a2:$mode_t;||s
devname_r|*c|a1:$dev_t;,a2:$mode_t;,buf:*c,len:i||s
digittoint|i|c:i||9
dirname_r|*c|a1:^c,a2:*c||v
disconnectx|i|a1:i,a2:u,a3:u||13
dispatch_after|v|when:k,queue:&dispatch_queue_t;,block:p||15
dispatch_after_f|v|when:k,queue:&dispatch_queue_t;,context:*v,work:p||15
dispatch_allow_send_signals|i|preserve_signum:i||15
dispatch_apply|v|iterations:z,queue:&dispatch_queue_t;,block:p||15
dispatch_apply_f|v|iterations:z,queue:&dispatch_queue_t;,context:*v,work:p||15
dispatch_assert_queue|v|queue:&dispatch_queue_t;||15
dispatch_assert_queue_barrier|v|queue:&dispatch_queue_t;||15
dispatch_assert_queue_not|v|queue:&dispatch_queue_t;||15
dispatch_async|v|queue:&dispatch_queue_t;,block:p||15
dispatch_async_and_wait|v|queue:&dispatch_queue_t;,block:p||15
dispatch_async_and_wait_f|v|queue:&dispatch_queue_t;,context:*v,work:p||15
dispatch_async_f|v|queue:&dispatch_queue_t;,context:*v,work:p||15
dispatch_barrier_async|v|queue:&dispatch_queue_t;,block:p||15
dispatch_barrier_async_and_wait|v|queue:&dispatch_queue_t;,block:p||15
dispatch_barrier_async_and_wait_f|v|queue:&dispatch_queue_t;,context:*v,work:p||15
dispatch_barrier_async_f|v|queue:&dispatch_queue_t;,context:*v,work:p||15
dispatch_barrier_sync|v|queue:&dispatch_queue_t;,block:p||15
dispatch_barrier_sync_f|v|queue:&dispatch_queue_t;,context:*v,work:p||15
dispatch_block_cancel|v|block:p||16
dispatch_block_notify|v|block:p,queue:&dispatch_queue_t;,notification_block:p||16
dispatch_block_perform|v|flags:u,block:p||16
dispatch_block_testcancel|y|block:p||16
dispatch_block_wait|y|block:p,timeout:k||16
dispatch_cancel|v|object:*v||17
dispatch_data_apply|o|data:&dispatch_data_t;,applier:p||18
dispatch_data_copy_region|&dispatch_data_t;|data:&dispatch_data_t;,location:z,offset_ptr:*z||18
dispatch_data_create|&dispatch_data_t;|buffer:^v,size:z,queue:&dispatch_queue_t;,destructor:p||18
dispatch_data_create_concat|&dispatch_data_t;|data1:&dispatch_data_t;,data2:&dispatch_data_t;||18
dispatch_data_create_map|&dispatch_data_t;|data:&dispatch_data_t;,buffer_ptr:*^v,size_ptr:*z||18
dispatch_data_create_subrange|&dispatch_data_t;|data:&dispatch_data_t;,offset:z,length:z||18
dispatch_data_get_size|z|data:&dispatch_data_t;||18
dispatch_get_current_queue|&dispatch_queue_t;|||15
dispatch_get_global_queue|&dispatch_queue_t;|identifier:y,flags:z||15
dispatch_get_specific|*v|key:^v||15
dispatch_group_async|v|group:&dispatch_group_t;,queue:&dispatch_queue_t;,block:p||19
dispatch_group_async_f|v|group:&dispatch_group_t;,queue:&dispatch_queue_t;,context:*v,work:p||19
dispatch_group_create|&dispatch_group_t;|||19
dispatch_group_enter|v|group:&dispatch_group_t;||19
dispatch_group_leave|v|group:&dispatch_group_t;||19
dispatch_group_notify|v|group:&dispatch_group_t;,queue:&dispatch_queue_t;,block:p||19
dispatch_group_notify_f|v|group:&dispatch_group_t;,queue:&dispatch_queue_t;,context:*v,work:p||19
dispatch_group_wait|y|group:&dispatch_group_t;,timeout:k||19
dispatch_io_barrier|v|channel:&dispatch_io_t;,barrier:p||1a
dispatch_io_close|v|channel:&dispatch_io_t;,flags:m||1a
dispatch_io_create|&dispatch_io_t;|type:m,fd:i,queue:&dispatch_queue_t;,cleanup_handler:p||1a
dispatch_io_create_with_io|&dispatch_io_t;|type:m,io:&dispatch_io_t;,queue:&dispatch_queue_t;,cleanup_handler:p||1a
dispatch_io_create_with_path|&dispatch_io_t;|type:m,path:^c,oflag:i,mode:$mode_t;,queue:&dispatch_queue_t;,cleanup_handler:p||1a
dispatch_io_get_descriptor|i|channel:&dispatch_io_t;||1a
dispatch_io_read|v|channel:&dispatch_io_t;,offset:$off_t;,length:z,queue:&dispatch_queue_t;,io_handler:p||1a
dispatch_io_set_high_water|v|channel:&dispatch_io_t;,high_water:z||1a
dispatch_io_set_interval|v|channel:&dispatch_io_t;,interval:k,flags:m||1a
dispatch_io_set_low_water|v|channel:&dispatch_io_t;,low_water:z||1a
dispatch_io_write|v|channel:&dispatch_io_t;,offset:$off_t;,data:&dispatch_data_t;,queue:&dispatch_queue_t;,io_handler:p||1a
dispatch_main|v||n|15
dispatch_once|v|predicate:*y,block:p||1b
dispatch_once_f|v|predicate:*y,context:*v,function:p||1b
dispatch_queue_attr_make_initially_inactive|&dispatch_queue_attr_t;|attr:&dispatch_queue_attr_t;||15
dispatch_queue_attr_make_with_autorelease_frequency|&dispatch_queue_attr_t;|attr:&dispatch_queue_attr_t;,frequency:u||15
dispatch_queue_attr_make_with_qos_class|&dispatch_queue_attr_t;|attr:&dispatch_queue_attr_t;,qos_class:u,relative_priority:i||15
dispatch_queue_create|&dispatch_queue_t;|label:^c,attr:&dispatch_queue_attr_t;||15
dispatch_queue_create_with_target|&dispatch_queue_t;|label:^c,attr:&dispatch_queue_attr_t;,target:&dispatch_queue_t;||15
dispatch_queue_get_label|^c|queue:&dispatch_queue_t;||15
dispatch_queue_get_qos_class|u|queue:&dispatch_queue_t;,relative_priority_ptr:*i||15
dispatch_queue_get_specific|*v|queue:&dispatch_queue_t;,key:^v||15
dispatch_queue_set_specific|v|queue:&dispatch_queue_t;,key:^v,context:*v,destructor:p||15
dispatch_read|v|fd:i,length:z,queue:&dispatch_queue_t;,handler:p||1a
dispatch_semaphore_create|&dispatch_semaphore_t;|value:y||1c
dispatch_semaphore_signal|y|dsema:&dispatch_semaphore_t;||1c
dispatch_semaphore_wait|y|dsema:&dispatch_semaphore_t;,timeout:k||1c
dispatch_source_cancel|v|source:&dispatch_source_t;||1d
dispatch_source_create|&dispatch_source_t;|type:&dispatch_source_type_t;,handle:z,mask:z,queue:&dispatch_queue_t;||1d
dispatch_source_get_data|z|source:&dispatch_source_t;||1d
dispatch_source_get_handle|z|source:&dispatch_source_t;||1d
dispatch_source_get_mask|z|source:&dispatch_source_t;||1d
dispatch_source_merge_data|v|source:&dispatch_source_t;,value:z||1d
dispatch_source_set_cancel_handler|v|source:&dispatch_source_t;,handler:p||1d
dispatch_source_set_cancel_handler_f|v|source:&dispatch_source_t;,handler:p||1d
dispatch_source_set_event_handler|v|source:&dispatch_source_t;,handler:p||1d
dispatch_source_set_event_handler_f|v|source:&dispatch_source_t;,handler:p||1d
dispatch_source_set_registration_handler|v|source:&dispatch_source_t;,handler:p||1d
dispatch_source_set_registration_handler_f|v|source:&dispatch_source_t;,handler:p||1d
dispatch_source_set_timer|v|source:&dispatch_source_t;,start:k,interval:k,leeway:k||1d
dispatch_source_testcancel|y|source:&dispatch_source_t;||1d
dispatch_sync|v|queue:&dispatch_queue_t;,block:p||15
dispatch_sync_f|v|queue:&dispatch_queue_t;,context:*v,work:p||15
dispatch_testcancel|y|object:*v||17
dispatch_time|k|when:k,delta:j||1e
dispatch_wait|y|object:*v,timeout:k||17
dispatch_walltime|k|when:^@struct timespec;,delta:j||1e
dispatch_workloop_create|&dispatch_queue_t;|label:^c||1f
dispatch_workloop_create_inactive|&dispatch_queue_t;|label:^c||1f
dispatch_workloop_set_autorelease_frequency|v|workloop:&dispatch_queue_t;,frequency:u||1f
dispatch_workloop_set_os_workgroup|v|workloop:&dispatch_queue_t;,workgroup:&os_workgroup_t;||1f
dispatch_write|v|fd:i,data:&dispatch_data_t;,queue:&dispatch_queue_t;,handler:p||1a
dladdr|i|addr:^v,info:*@Dl_info;||1g
dlopen_preflight|o|a1:^c||1g
endnetgrent|v|||1h
endrpcent|v|||1h
endusershell|v|||n
etap_trace_thread|i|target_act:u,trace_status:i||o
exchangedata|i|a1:^c,a2:^c,a3:u||n
execvP|i|file:^c,searchpath:^c,argv:^*c||n
fchflags|i|a1:i,a2:u||z
fchflagsat|i|a1:i,a2:^c,a3:u,a4:i||z
fchmodx_np|i|a1:i,a2:&filesec_t;||z
fcopyfile|i|from_fd:i,to_fd:i,a3:&copyfile_state_t;,flags:u||14
fdclosedir|i|a1:*@DIR;||f
fdscandir|i|a1:i,a2:***@struct dirent;,a3:p,a4:p||f
fdscandir_b|i|a1:i,a2:***@struct dirent;,a3:p,a4:p||f
fflagstostr|*c|a1:m||n
ffsctl|i|a1:i,a2:m,a3:*v,a4:u||n
ffsl|i|a1:l||w
ffsll|i|a1:q||w
fgetattrlist|i|a1:i,a2:*v,a3:*v,attrBufSize:z,a5:u||n
fgetln|*c|a1:*@FILE;,len:*z||h
fgetwln|*w|a1:*@FILE;,len:*z||1i
fhopen|i|a1:^@struct fhandle;,a2:i||1j
filesec_dup|&filesec_t;|a1:&filesec_t;||1k
filesec_free|v|a1:&filesec_t;||1k
filesec_get_property|i|a1:&filesec_t;,a2:u,a3:*v||1k
filesec_init|&filesec_t;|||1k
filesec_query_property|i|a1:&filesec_t;,a2:u,a3:*i||1k
filesec_set_property|i|a1:&filesec_t;,a2:u,a3:^v||1k
filesec_unset_property|i|a1:&filesec_t;,a2:u||1k
flock|i|fd:i,operation:i||1k
fls|i|a1:i||w
flsl|i|a1:l||w
flsll|i|a1:q||w
fmount|i|a1:^c,a2:i,a3:i,a4:*v||1j
fmtcheck|^c|a1:^c,a2:^c||h
fpurge|i|a1:*@FILE;||h
freadlink|y|a1:i,a2:*c,a3:z||1l
freehostent|v|a1:*@struct hostent;||1h
freeifaddrs|v|a1:*@struct ifaddrs;||1m
freeifmaddrs|v|a1:*@struct ifmaddrs;||1m
fsctl|i|a1:^c,a2:m,a3:*v,a4:u||n
fsetattrlist|i|a1:i,a2:*v,a3:*v,attrBufSize:z,a5:u||n
fstatfs|i|a1:i,a2:*@struct statfs;||1j
fstatx_np|i|a1:i,a2:*@struct stat;,a3:&filesec_t;||z
fsync_volume_np|i|a1:i,a2:i||n
fts_children|*@FTSENT;|a1:*@FTS;,a2:i||1n
fts_close|i|a1:*@FTS;||1n
fts_open|*@FTS;|a1:^*c,a2:i,a3:p||1n
fts_open_b|*@FTS;|a1:^*c,a2:i,a3:p||1n
fts_read|*@FTSENT;|a1:*@FTS;||1n
fts_set|i|a1:*@FTS;,a2:*@FTSENT;,a3:i||1n
funmount|i|a1:i,a2:i||1j
funopen|*@FILE;|a1:^v,a2:p,a3:p,a4:p,a5:p||h
futimes|i|a1:i,a2:^@struct timeval;||q
getattrlist|i|a1:^c,a2:*v,a3:*v,attrBufSize:z,a5:u||n
getattrlistat|i|a1:i,a2:^c,a3:*v,a4:*v,a5:z,a6:m||1l
getattrlistbulk|i|a1:i,a2:*v,a3:*v,a4:z,a5:k||1l
getaudit|i|a1:*@struct auditinfo;||t
getaudit_addr|i|a1:*@struct auditinfo_addr;,a2:i||t
getauid|i|a1:*u||t
getbsize|*c|a1:*i,a2:*l||s
getdirentries|i|a1:i,a2:*c,nbytes:i,a4:*l||f
getdirentriesattr|i|a1:i,a2:*v,a3:*v,attrBufSize:z,a5:*u,a6:*u,a7:*u,a8:u||n
getdomainname|i|a1:*c,namelen:i||n
getdtablesize|i|||n
getentropy|i|buffer:*v,size:z||1o
getfh|i|a1:^c,a2:*@fhandle_t;||1j
getfsstat|i|a1:*@struct statfs;,a2:i,a3:i||1j
getgrouplist|i|a1:^c,a2:i,a3:*i,ngroups:*i||n
getgruuid|*@struct group;|a1:*h||1p
getgruuid_r|i|a1:*h,a2:*@struct group;,a3:*c,a4:z,a5:**@struct group;||1p
gethostbyname2|*@struct hostent;|a1:^c,a2:i||1h
gethostuuid|i|a1:*h,a2:^@struct timespec;||1q
getifaddrs|i|a1:**@struct ifaddrs;||1m
getifmaddrs|i|a1:**@struct ifmaddrs;||1m
getiopolicy_np|i|a1:i,a2:i||1r
getipnodebyaddr|*@struct hostent;|a1:^v,a2:z,a3:i,a4:*i||1h
getipnodebyname|*@struct hostent;|a1:^c,a2:i,a3:i,a4:*i||1h
getloadavg|i|a1:*d,nelem:i||s
getmntinfo|i|a1:**@struct statfs;,a2:i||1j
getmntinfo_r_np|i|a1:**@struct statfs;,a2:i||1j
getmode|$mode_t;|a1:^v,a2:$mode_t;||n
getnetgrent|i|a1:**c,a2:**c,a3:**c||1h
getopt_long|i|argc:i,nargv:^*c,options:^c,long_options:^@struct option;,idx:*i||1s
getopt_long_only|i|argc:i,nargv:^*c,options:^c,long_options:^@struct option;,idx:*i||1s
getpagesize|i|||n
getpass|*c|a1:^c||n
getpeereid|i|a1:i,a2:*u,a3:*u||n
getprogname|^c|||s
getpwuuid|*@struct passwd;|a1:*h||1t
getpwuuid_r|i|a1:*h,a2:*@struct passwd;,a3:*c,a4:z,a5:**@struct passwd;||1t
getrpcbyname|*@struct rpcent;|name:^c||1h
getrpcbynumber|*@struct rpcent;|number:i||1h
getrpcent|*@struct rpcent;|||1h
getsgroups_np|i|a1:*i,a2:*h||n
getsourcefilter|i|a1:i,a2:u,a3:*@struct sockaddr;,a4:u,a5:*u,a6:*u,a7:*@struct sockaddr_storage;||x
getumask|$mode_t;|||z
getusershell|*c|||n
getvfsbyname|i|a1:^c,a2:*@struct vfsconf;||1j
getw|i|file:*@FILE;||h
getwd|*c|a1:*c||n
getwgroups_np|i|a1:*i,a2:*h||n
group_from_gid|*c|a1:u,a2:i||1p
heapsort|i|base:*v,nel:z,width:z,compar:p||s
heapsort_b|i|base:*v,nel:z,width:z,compar:p||s
herror|v|a1:^c||1h
host_check_multiuser_mode|i|host:u,multiuser_mode:*u||i
host_create_mach_voucher|i|host:u,recipes:*h,recipesCnt:u,voucher:*u||i
host_create_mach_voucher_trap|i|host:u,recipes:*h,recipes_size:i,voucher:*u||j
host_default_memory_manager|i|host_priv:u,default_manager:*u,cluster_size:u||1u
host_get_UNDServer|i|host:u,server:*u||1u
host_get_atm_diagnostic_flag|i|host:u,diagnostic_flag:*u||i
host_get_boot_info|i|host_priv:u,boot_info:*c||1u
host_get_clock_control|i|host_priv:u,clock_id:i,clock_ctrl:*u||1u
host_get_clock_service|i|host:u,clock_id:i,clock_serv:*u||i
host_get_exception_ports|i|host_priv:u,exception_mask:u,masks:*u,masksCnt:*u,old_handlers:*u,old_behaviors:*i,old_flavors:*i||1u
host_get_io_main|i|host:u,io_main:*u||i
host_get_multiuser_config_flags|i|host:u,multiuser_flags:*u||i
host_get_special_port|i|host_priv:u,node:i,which:i,port:*u||1u
host_info|i|host:u,flavor:i,host_info_out:*i,host_info_outCnt:*u||i
host_kernel_version|i|host:u,kernel_version:*c||i
host_lockgroup_info|i|host_priv_t:u,lockgroup_info:*&lockgroup_info_array_t;,lockgroup_infoCnt:*u||i
host_page_size|i|a1:u,a2:*z||1v
host_priv_statistics|i|host_priv:u,flavor:i,host_info_out:*i,host_info_outCnt:*u||1u
host_processor_info|i|host:u,flavor:i,out_processor_count:*u,out_processor_info:**i,out_processor_infoCnt:*u||i
host_processor_set_priv|i|host_priv:u,set_name:u,set:*u||1u
host_processor_sets|i|host_priv:u,processor_sets:**u,processor_setsCnt:*u||1u
host_processors|i|host_priv:u,out_processor_list:**u,out_processor_listCnt:*u||1u
host_reboot|i|host_priv:u,options:i||1u
host_register_mach_voucher_attr_manager|i|host:u,attr_manager:u,default_value:k,new_key:*u,new_attr_control:*u||i
host_register_well_known_mach_voucher_attr_manager|i|host:u,attr_manager:u,default_value:k,key:u,new_attr_control:*u||i
host_request_notification|i|host:u,notify_type:i,notify_port:u||i
host_set_UNDServer|i|host:u,server:u||1u
host_set_atm_diagnostic_flag|i|host:u,diagnostic_flag:u||i
host_set_exception_ports|i|host_priv:u,exception_mask:u,new_port:u,behavior:i,new_flavor:i||1u
host_set_multiuser_config_flags|i|host_priv:u,multiuser_flags:u||i
host_set_special_port|i|host_priv:u,which:i,port:u||1u
host_statistics|i|host_priv:u,flavor:i,host_info_out:*i,host_info_outCnt:*u||i
host_statistics64|i|host_priv:u,flavor:i,host_info64_out:*i,host_info64_outCnt:*u||i
host_swap_exception_ports|i|host_priv:u,exception_mask:u,new_port:u,behavior:i,new_flavor:i,masks:*u,masksCnt:*u,old_handlerss:*u,old_behaviors:*i,old_flavors:*i||1u
host_virtual_physical_table_info|i|host:u,info:*&hash_info_bucket_array_t;,infoCnt:*u||i
hstrerror|^c|a1:i||1h
iconv_canonicalize|^c|a1:^c||d
iconv_open_into|i|a1:^c,a2:^c,a3:*@iconv_allocation_t;||d
iconvctl|i|a1:&iconv_t;,a2:i,a3:*v||d
iconvlist|v|do_one:p,a2:*v||d
index|*c|a1:^c,a2:i||w
inet6_opt_append|i|a1:*v,a2:u,a3:i,a4:h,a5:u,a6:h,a7:**v||1w
inet6_opt_find|i|a1:*v,a2:u,a3:i,a4:h,a5:*u,a6:**v||1w
inet6_opt_finish|i|a1:*v,a2:u,a3:i||1w
inet6_opt_get_val|i|a1:*v,a2:i,a3:*v,a4:u||1w
inet6_opt_init|i|a1:*v,a2:u||1w
inet6_opt_next|i|a1:*v,a2:u,a3:i,a4:*h,a5:*u,a6:**v||1w
inet6_opt_set_val|i|a1:*v,a2:i,a3:*v,a4:u||1w
inet6_option_alloc|*h|a1:*@struct cmsghdr;,a2:i,a3:i,a4:i||1w
inet6_option_append|i|a1:*@struct cmsghdr;,a2:^h,a3:i,a4:i||1w
inet6_option_find|i|a1:^@struct cmsghdr;,a2:**h,a3:i||1w
inet6_option_init|i|a1:*v,a2:**@struct cmsghdr;,a3:i||1w
inet6_option_next|i|a1:^@struct cmsghdr;,a2:**h||1w
inet6_option_space|i|a1:i||1w
inet6_rth_add|i|a1:*v,a2:^@struct in6_addr;||1w
inet6_rth_getaddr|*@struct in6_addr;|a1:^v,a2:i||1w
inet6_rth_init|*v|a1:*v,a2:u,a3:i,a4:i||1w
inet6_rth_reverse|i|a1:^v,a2:*v||1w
inet6_rth_segments|i|a1:^v||1w
inet6_rth_space|u|a1:i,a2:i||1w
inet6_rthdr_add|i|a1:*@struct cmsghdr;,a2:^@struct in6_addr;,a3:u||1w
inet6_rthdr_getaddr|*@struct in6_addr;|a1:*@struct cmsghdr;,a2:i||1w
inet6_rthdr_getflags|i|a1:^@struct cmsghdr;,a2:i||1w
inet6_rthdr_init|*@struct cmsghdr;|a1:*v,a2:i||1w
inet6_rthdr_lasthop|i|a1:*@struct cmsghdr;,a2:u||1w
inet6_rthdr_segments|i|a1:^@struct cmsghdr;||1w
inet6_rthdr_space|z|a1:i,a2:i||1w
inet_aton|i|cp:^c,pin:*@struct in_addr;||p
inet_net_ntop|*c|a1:i,a2:^v,a3:i,a4:*c,size:z||p
inet_net_pton|i|a1:i,a2:^c,a3:*v,size:z||p
inet_neta|*c|a1:u,a2:*c,size:z||p
inet_network|u|a1:^c||p
inet_nsap_addr|u|a1:^c,a2:*h,maxlen:i||p
inet_nsap_ntoa|*c|binlen:i,a2:^h,a3:*c||p
initgroups|i|a1:^c,a2:i||n
innetgr|i|a1:^c,a2:^c,a3:^c,a4:^c||1h
ioctl|i|fildes:i,request:m|v|1x
iruserok|i|a1:m,a2:i,a3:^c,a4:^c||n
iruserok_sa|i|a1:^v,a2:i,a3:i,a4:^c,a5:^c||n
ishexnumber|i|c:i||9
isideogram|i|c:i||9
isnumber|i|c:i||9
isphonogram|i|c:i||9
isrune|i|c:i||9
issetugid|i|||n
isspecial|i|c:i||9
kevent|i|kq:i,changelist:^@struct kevent;,nchanges:i,eventlist:*@struct kevent;,nevents:i,timeout:^@struct timespec;||1y
kevent64|i|kq:i,changelist:^@struct kevent64_s;,nchanges:i,eventlist:*@struct kevent64_s;,nevents:i,flags:u,timeout:^@struct timespec;||1y
kext_request|i|host_priv:u,user_log_flags:u,request_data:z,request_dataCnt:u,response_data:*z,response_dataCnt:*u,log_data:*z,log_dataCnt:*u,op_result:*i||1u
kmod_control|i|host_priv:u,module:i,flavor:i,data:**v,dataCnt:*u||1u
kmod_create|i|host_priv:u,info:z,module:*i||1u
kmod_destroy|i|host_priv:u,module:i||1u
kmod_get_info|i|host:u,modules:**v,modulesCnt:*u||i
kqueue|i|||1y
launch_activate_socket|i|name:^c,fds:**i,cnt:*z||1z
launch_data_alloc|&launch_data_t;|type:u||1z
launch_data_array_get_count|z|larray:&launch_data_t;||1z
launch_data_array_get_index|&launch_data_t;|larray:&launch_data_t;,idx:z||1z
launch_data_array_set_index|o|larray:&launch_data_t;,lval:&launch_data_t;,idx:z||1z
launch_data_copy|&launch_data_t;|ld:&launch_data_t;||1z
launch_data_dict_get_count|z|ldict:&launch_data_t;||1z
launch_data_dict_insert|o|ldict:&launch_data_t;,lval:&launch_data_t;,key:^c||1z
launch_data_dict_iterate|v|ldict:&launch_data_t;,iterator:p,ctx:*v||1z
launch_data_dict_lookup|&launch_data_t;|ldict:&launch_data_t;,key:^c||1z
launch_data_dict_remove|o|ldict:&launch_data_t;,key:^c||1z
launch_data_free|v|ld:&launch_data_t;||1z
launch_data_get_bool|o|ld:&launch_data_t;||1z
launch_data_get_errno|i|ld:&launch_data_t;||1z
launch_data_get_fd|i|ld:&launch_data_t;||1z
launch_data_get_integer|q|ld:&launch_data_t;||1z
launch_data_get_machport|u|ld:&launch_data_t;||1z
launch_data_get_opaque|*v|ld:&launch_data_t;||1z
launch_data_get_opaque_size|z|ld:&launch_data_t;||1z
launch_data_get_real|d|ld:&launch_data_t;||1z
launch_data_get_string|^c|ld:&launch_data_t;||1z
launch_data_get_type|u|ld:&launch_data_t;||1z
launch_data_new_bool|&launch_data_t;|val:o||1z
launch_data_new_fd|&launch_data_t;|fd:i||1z
launch_data_new_integer|&launch_data_t;|val:q||1z
launch_data_new_machport|&launch_data_t;|val:u||1z
launch_data_new_opaque|&launch_data_t;|bytes:^v,sz:z||1z
launch_data_new_real|&launch_data_t;|val:d||1z
launch_data_new_string|&launch_data_t;|val:^c||1z
launch_data_set_bool|o|ld:&launch_data_t;,val:o||1z
launch_data_set_fd|o|ld:&launch_data_t;,fd:i||1z
launch_data_set_integer|o|ld:&launch_data_t;,val:q||1z
launch_data_set_machport|o|ld:&launch_data_t;,mp:u||1z
launch_data_set_opaque|o|ld:&launch_data_t;,bytes:^v,sz:z||1z
launch_data_set_real|o|ld:&launch_data_t;,val:d||1z
launch_data_set_string|o|ld:&launch_data_t;,val:^c||1z
launch_get_fd|i|||1z
launch_msg|&launch_data_t;|request:&launch_data_t;||1z
lchflags|i|a1:^c,a2:u||z
lchmod|i|a1:^c,a2:$mode_t;||z
libiconv_set_relocation_prefix|v|a1:^c,a2:^c||d
lock_set_create|i|task:u,new_lock_set:*u,n_ulocks:i,policy:i||20
lock_set_destroy|i|task:u,lock_set:u||20
longjmperror|v|||21
lstatx_np|i|a1:^c,a2:*@struct stat;,a3:&filesec_t;||z
lutimes|i|a1:^c,a2:^@struct timeval;||q
mach_absolute_time|k|||22
mach_approximate_time|k|||22
mach_continuous_approximate_time|k|||22
mach_continuous_time|k|||22
mach_error|v|str:^c,error_value:i||23
mach_error_string|*c|error_value:i||23
mach_error_type|*c|error_value:i||23
mach_generate_activity_id|i|target:u,count:i,activity_id:*k||j
mach_host_self|u|||1v
mach_make_memory_entry|i|target_task:u,size:*z,offset:z,permission:i,object_handle:*u,parent_entry:u||24
mach_make_memory_entry_64|i|target_task:u,size:*r,offset:r,permission:i,object_handle:*u,parent_entry:u||24
mach_memory_info|i|host:u,names:*&mach_zone_name_array_t;,namesCnt:*u,info:*&mach_zone_info_array_t;,infoCnt:*u,memory_info:*&mach_memory_info_array_t;,memory_infoCnt:*u||i
mach_memory_info_redacted|i|host:u,names:*&mach_zone_name_array_t;,namesCnt:*u,info:*&mach_zone_info_array_t;,infoCnt:*u,memory_info:*&mach_memory_info_array_t;,memory_infoCnt:*u||i
mach_memory_object_memory_entry|i|host:u,internal:i,size:z,permission:i,pager:u,entry_handle:*u||i
mach_memory_object_memory_entry_64|i|host:u,internal:i,size:r,permission:i,pager:u,entry_handle:*u||i
mach_msg|i|msg:*@mach_msg_header_t;,option:i,send_size:u,rcv_size:u,rcv_name:u,timeout:u,notify:u||25
mach_msg_destroy|v|a1:*@mach_msg_header_t;||10
mach_msg_overwrite|i|msg:*@mach_msg_header_t;,option:i,send_size:u,rcv_size:u,rcv_name:u,timeout:u,notify:u,rcv_msg:*@mach_msg_header_t;,rcv_limit:u||25
mach_msg_receive|i|a1:*@mach_msg_header_t;||10
mach_msg_send|i|a1:*@mach_msg_header_t;||10
mach_msg_server|i|a1:p,a2:u,a3:u,a4:i||10
mach_msg_server_importance|i|a1:p,a2:u,a3:u,a4:i||10
mach_msg_server_once|i|a1:p,a2:u,a3:u,a4:i||10
mach_port_allocate|i|task:u,right:u,name:*u||26
mach_port_allocate_full|i|task:u,right:u,proto:u,qos:*@mach_port_qos_t;,name:*u||26
mach_port_allocate_name|i|task:u,right:u,name:u||26
mach_port_allocate_qos|i|task:u,right:u,qos:*@mach_port_qos_t;,name:*u||26
mach_port_assert_attributes|i|task:u,name:u,flavor:i,info:*i,infoCnt:u||26
mach_port_construct|i|task:u,options:&mach_port_options_ptr_t;,context:z,name:*u||26
mach_port_deallocate|i|task:u,name:u||26
mach_port_destroy|i|task:u,name:u||26
mach_port_destruct|i|task:u,name:u,srdelta:i,guard:z||26
mach_port_dnrequest_info|i|task:u,name:u,dnr_total:*u,dnr_used:*u||26
mach_port_extract_member|i|task:u,name:u,pset:u||26
mach_port_extract_right|i|task:u,name:u,msgt_name:u,poly:*u,polyPoly:*u||26
mach_port_get_attributes|i|task:u,name:u,flavor:i,port_info_out:*i,port_info_outCnt:*u||26
mach_port_get_context|i|task:u,name:u,context:*z||26
mach_port_get_refs|i|task:u,name:u,right:u,refs:*u||26
mach_port_get_service_port_info|i|task:u,name:u,sp_info_out:*@mach_service_port_info_data_t;||26
mach_port_get_set_status|i|task:u,name:u,members:**u,membersCnt:*u||26
mach_port_get_srights|i|task:u,name:u,srights:*u||26
mach_port_guard|i|task:u,name:u,guard:z,strict:i||26
mach_port_guard_with_flags|i|task:u,name:u,guard:z,flags:k||26
mach_port_insert_member|i|task:u,name:u,pset:u||26
mach_port_insert_right|i|task:u,name:u,poly:u,polyPoly:u||26
mach_port_is_connection_for_service|i|task:u,connection_port:u,service_port:u,filter_policy_id:*k||26
mach_port_kernel_object|i|task:u,name:u,object_type:*u,object_addr:*u||26
mach_port_kobject|i|task:u,name:u,object_type:*u,object_addr:*k||26
mach_port_kobject_description|i|task:u,name:u,object_type:*u,object_addr:*k,description:*c||26
mach_port_mod_refs|i|task:u,name:u,right:u,delta:i||26
mach_port_move_member|i|task:u,member:u,after:u||26
mach_port_names|i|task:u,names:**u,namesCnt:*u,types:**u,typesCnt:*u||26
mach_port_peek|i|task:u,name:u,trailer_type:u,request_seqnop:*u,msg_sizep:*u,msg_idp:*i,trailer_infop:*c,trailer_infopCnt:*u||26
mach_port_rename|i|task:u,old_name:u,new_name:u||26
mach_port_request_notification|i|task:u,name:u,msgid:i,sync:u,notify:u,notifyPoly:u,previous:*u||26
mach_port_set_attributes|i|task:u,name:u,flavor:i,port_info:*i,port_infoCnt:u||26
mach_port_set_context|i|task:u,name:u,context:z||26
mach_port_set_mscount|i|task:u,name:u,mscount:u||26
mach_port_set_seqno|i|task:u,name:u,seqno:u||26
mach_port_space_basic_info|i|task:u,basic_info:*@ipc_info_space_basic_t;||26
mach_port_space_info|i|space:u,space_info:*@ipc_info_space_t;,table_info:*&ipc_info_name_array_t;,table_infoCnt:*u,tree_info:*&ipc_info_tree_name_array_t;,tree_infoCnt:*u||26
mach_port_swap_guard|i|task:u,name:u,old_guard:z,new_guard:z||26
mach_port_type|i|task:u,name:u,ptype:*u||26
mach_port_unguard|i|task:u,name:u,guard:z||26
mach_ports_lookup|i|target_task:u,init_port_set:**u,init_port_setCnt:*u||20
mach_ports_register|i|target_task:u,init_port_set:*u,init_port_setCnt:u||20
mach_task_is_self|i|task:u||1v
mach_thread_self|u|||1v
mach_timebase_info|i|info:&mach_timebase_info_t;||22
mach_vm_allocate|i|target:u,address:*k,size:k,flags:i||k
mach_vm_behavior_set|i|target_task:u,address:k,size:k,new_behavior:i||k
mach_vm_copy|i|target_task:u,source_address:k,size:k,dest_address:k||k
mach_vm_deallocate|i|target:u,address:k,size:k||k
mach_vm_inherit|i|target_task:u,address:k,size:k,new_inheritance:u||k
mach_vm_machine_attribute|i|target_task:u,address:k,size:k,attribute:u,value:*i||k
mach_vm_map|i|target_task:u,address:*k,size:k,mask:k,flags:i,object:u,offset:r,copy:i,cur_protection:i,max_protection:i,inheritance:u||k
mach_vm_msync|i|target_task:u,address:k,size:k,sync_flags:u||k
mach_vm_page_info|i|target_task:u,address:k,flavor:i,info:*i,infoCnt:*u||k
mach_vm_page_query|i|target_map:u,offset:k,disposition:*i,ref_count:*i||k
mach_vm_page_range_query|i|target_map:u,address:k,size:k,dispositions:k,dispositions_count:*k||k
mach_vm_protect|i|target_task:u,address:k,size:k,set_maximum:i,new_protection:i||k
mach_vm_purgable_control|i|target_task:u,address:k,control:i,state:*i||k
mach_vm_range_create|i|target_task:u,flavor:u,recipes:*h,recipesCnt:u||k
mach_vm_read|i|target_task:u,address:k,size:k,data:*z,dataCnt:*u||k
mach_vm_read_list|i|target_task:u,data_list:*@struct mach_vm_read_entry;,count:u||k
mach_vm_read_overwrite|i|target_task:u,address:k,size:k,data:k,outsize:*k||k
mach_vm_reallocate|i|target_task:u,src:k,src_size:k,dst:*k,dst_size:k,align_mask:k,options:i,flags:i||k
mach_vm_reclaim_update_kernel_accounting_trap|i|target_tport:u,bytes_reclaimed:*k,next_deadline:*k||j
mach_vm_region|i|target_task:u,address:*k,size:*k,flavor:i,info:*i,infoCnt:*u,object_name:*u||k
mach_vm_region_info|i|task:u,address:z,region:*@vm_info_region_t;,objects:*&vm_info_object_array_t;,objectsCnt:*u||24
mach_vm_region_info_64|i|task:u,address:z,region:*@vm_info_region_64_t;,objects:*&vm_info_object_array_t;,objectsCnt:*u||24
mach_vm_region_recurse|i|target_task:u,address:*k,size:*k,nesting_depth:*u,info:*i,infoCnt:*u||k
mach_vm_remap|i|target_task:u,target_address:*k,size:k,mask:k,flags:i,src_task:u,src_address:k,copy:i,cur_protection:*i,max_protection:*i,inheritance:u||k
mach_vm_remap_new|i|target_task:u,target_address:*k,size:k,mask:k,flags:i,src_task:u,src_address:k,copy:i,cur_protection:*i,max_protection:*i,inheritance:u||k
mach_vm_update_pointers_with_remote_tags|i|target:u,in_pointer_list:*k,in_pointer_listCnt:u,out_pointer_list:*k,out_pointer_listCnt:*u||k
mach_vm_wire|i|host_priv:u,task:u,address:k,size:k,desired_access:i||1u
mach_vm_write|i|target_task:u,address:k,data:z,dataCnt:u||k
mach_voucher_deallocate|i|voucher:u||25
mach_voucher_extract_attr_recipe_trap|i|voucher_name:u,key:u,recipe:*h,recipe_size:*u||j
mach_wait_until|i|deadline:k||22
mach_zone_info|i|host:u,names:*&mach_zone_name_array_t;,namesCnt:*u,info:*&mach_zone_info_array_t;,infoCnt:*u||i
macx_backing_store_recovery|i|pid:i||j
macx_backing_store_suspend|i|suspend:i||j
macx_swapoff|i|filename:k,flags:i||j
macx_swapon|i|filename:k,flags:i,size:i,priority:i||j
macx_triggers|i|hi_water:i,low_water:i,flags:i,alert_port:u||j
madvise|i|addr:*v,len:z,advice:i||27
malloc_create_zone|*@malloc_zone_t;|start_size:z,flags:u||28
malloc_default_purgeable_zone|*@malloc_zone_t;|||28
malloc_default_zone|*@malloc_zone_t;|||28
malloc_destroy_zone|v|zone:*@malloc_zone_t;||28
malloc_get_all_zones|i|task:u,reader:p,addresses:**z,count:*u||28
malloc_get_zone_name|^c|zone:*@malloc_zone_t;||28
malloc_good_size|z|size:z||28
malloc_make_nonpurgeable|i|ptr:*v||28
malloc_make_purgeable|v|ptr:*v||28
malloc_printf|v|format:^c|vf0|28
malloc_set_zone_name|v|zone:*@malloc_zone_t;,name:^c||28
malloc_size|z|ptr:^v||28
malloc_type_aligned_alloc|*v|alignment:z,size:z,type_id:r|a1|29
malloc_type_calloc|*v|count:z,size:z,type_id:r|a0a1|29
malloc_type_free|v|ptr:*v,type_id:r||29
malloc_type_malloc|*v|size:z,type_id:r|a0|29
malloc_type_posix_memalign|i|memptr:**v,alignment:z,size:z,type_id:r||29
malloc_type_realloc|*v|ptr:*v,size:z,type_id:r|a1|29
malloc_type_valloc|*v|size:z,type_id:r|a0|29
malloc_type_zone_calloc|*v|zone:*@malloc_zone_t;,count:z,size:z,type_id:r|a1a2|29
malloc_type_zone_free|v|zone:*@malloc_zone_t;,ptr:*v,type_id:r||29
malloc_type_zone_malloc|*v|zone:*@malloc_zone_t;,size:z,type_id:r|a1|29
malloc_type_zone_malloc_with_options|*v|zone:*@malloc_zone_t;,alignment:z,size:z,type_id:r,opts:u|a2|28
malloc_type_zone_memalign|*v|zone:*@malloc_zone_t;,alignment:z,size:z,type_id:r|a2|29
malloc_type_zone_realloc|*v|zone:*@malloc_zone_t;,ptr:*v,size:z,type_id:r|a2|29
malloc_type_zone_valloc|*v|zone:*@malloc_zone_t;,size:z,type_id:r|a1|29
malloc_zone_batch_free|v|zone:*@malloc_zone_t;,to_be_freed:**v,num:u||28
malloc_zone_batch_malloc|u|zone:*@malloc_zone_t;,size:z,results:**v,num_requested:u||28
malloc_zone_calloc|*v|zone:*@malloc_zone_t;,num_items:z,size:z|a1a2|28
malloc_zone_check|i|zone:*@malloc_zone_t;||28
malloc_zone_disable_discharge_checking|v|zone:*@malloc_zone_t;||28
malloc_zone_discharge|v|zone:*@malloc_zone_t;,memory:*v||28
malloc_zone_enable_discharge_checking|i|zone:*@malloc_zone_t;||28
malloc_zone_enumerate_discharged_pointers|v|zone:*@malloc_zone_t;,report_discharged:p||28
malloc_zone_free|v|zone:*@malloc_zone_t;,ptr:*v||28
malloc_zone_from_ptr|*@malloc_zone_t;|ptr:^v||28
malloc_zone_log|v|zone:*@malloc_zone_t;,address:*v||28
malloc_zone_malloc|*v|zone:*@malloc_zone_t;,size:z|a1|28
malloc_zone_malloc_with_options|*v|zone:*@malloc_zone_t;,align:z,size:z,opts:u|a2|28
malloc_zone_memalign|*v|zone:*@malloc_zone_t;,alignment:z,size:z|a2|28
malloc_zone_pressure_relief|z|zone:*@malloc_zone_t;,goal:z||28
malloc_zone_print|v|zone:*@malloc_zone_t;,verbose:i||28
malloc_zone_print_ptr_info|v|ptr:*v||28
malloc_zone_realloc|*v|zone:*@malloc_zone_t;,ptr:*v,size:z|a2|28
malloc_zone_register|v|zone:*@malloc_zone_t;||28
malloc_zone_statistics|v|zone:*@malloc_zone_t;,stats:*@malloc_statistics_t;||28
malloc_zone_unregister|v|zone:*@malloc_zone_t;||28
malloc_zone_valloc|*v|zone:*@malloc_zone_t;,size:z|a1|28
memmem|*v|big:^v,big_len:z,little:^v,little_len:z||2a
memset_pattern16|v|b:*v,pattern16:^v,len:z||2a
memset_pattern4|v|b:*v,pattern4:^v,len:z||2a
memset_pattern8|v|b:*v,pattern8:^v,len:z||2a
memset_s|i|s:*v,smax:z,c:i,n:z||2a
mergesort|i|base:*v,nel:z,width:z,compar:p||s
mergesort_b|i|base:*v,nel:z,width:z,compar:p||s
mig_allocate|v|a1:*z,a2:z||2b
mig_dealloc_reply_port|v|reply_port:u||2b
mig_deallocate|v|a1:z,a2:z||2b
mig_get_reply_port|u|||2b
mig_put_reply_port|v|reply_port:u||2b
mig_reply_setup|v|a1:*@mach_msg_header_t;,a2:*@mach_msg_header_t;||10
mig_strncpy|i|dest:*c,src:^c,len:i||2b
mig_strncpy_zerofill|i|dest:*c,src:^c,len:i||2b
mincore|i|addr:^v,len:z,vec:*c||27
minherit|i|a1:*v,a2:z,a3:i||27
mkdirx_np|i|a1:^c,a2:&filesec_t;||z
mkdtemp|*c|template:*c||n
mkdtempat_np|*c|dfd:i,path:*c||n
mkfifox_np|i|a1:^c,a2:&filesec_t;||z
mkostemp|i|path:*c,oflags:i||n
mkostemps|i|path:*c,slen:i,oflags:i||n
mkostempsat_np|i|dfd:i,path:*c,slen:i,oflags:i||n
mkpath_np|i|path:^c,omode:$mode_t;||n
mkpathat_np|i|dfd:i,path:^c,omode:$mode_t;||n
mkstemp_dprotected_np|i|path:*c,dpclass:i,dpflags:i||n
mkstemps|i|a1:*c,a2:i||n
mkstempsat_np|i|dfd:i,path:*c,slen:i||n
mount|i|a1:^c,a2:^c,a3:i,a4:*v||1j
msgsys|i|a1:i|v|2c
nextwctype|$wint_t;|a1:$wint_t;,a2:$wctype_t;||2d
nfssvc|i|a1:i,a2:*v||n
open_dprotected_np|i|a1:^c,a2:i,a3:i,a4:i|v|1k
openat_authenticated_np|i|a1:i,a2:^c,a3:i,a4:i||1k
openat_dprotected_np|i|a1:i,a2:^c,a3:i,a4:i,a5:i|v|1k
openx_np|i|a1:^c,a2:i,a3:&filesec_t;||1k
os_log_create|&os_log_t;|subsystem:^c,category:^c||l
os_log_is_debug_enabled|o|log:&os_log_t;||l
os_log_is_enabled|o|log:&os_log_t;||l
os_log_type_enabled|o|oslog:&os_log_t;,type:u||l
os_release|v|object:*v||2e
os_retain|*v|object:*v||2e
os_trace_debug_enabled|o|||m
os_trace_info_enabled|o|||m
os_unfair_lock_assert_not_owner|v|lock:^@os_unfair_lock;||2f
os_unfair_lock_assert_owner|v|lock:^@os_unfair_lock;||2f
os_unfair_lock_lock|v|lock:&os_unfair_lock_t;||2f
os_unfair_lock_lock_with_flags|v|lock:&os_unfair_lock_t;,flags:u||2f
os_unfair_lock_trylock|o|lock:&os_unfair_lock_t;||2f
os_unfair_lock_unlock|v|lock:&os_unfair_lock_t;||2f
os_workgroup_cancel|v|wg:&os_workgroup_t;||2g
os_workgroup_copy_port|i|wg:&os_workgroup_t;,mach_port_out:*u||2g
os_workgroup_create_with_port|&os_workgroup_t;|name:^c,mach_port:u||2g
os_workgroup_create_with_workgroup|&os_workgroup_t;|name:^c,wg:&os_workgroup_t;||2g
os_workgroup_get_working_arena|*v|wg:&os_workgroup_t;,index_out:*u||2g
os_workgroup_interval_finish|i|wg:&os_workgroup_t;,data:&os_workgroup_interval_data_t;||2h
os_workgroup_interval_start|i|wg:&os_workgroup_t;,start:k,deadline:k,data:&os_workgroup_interval_data_t;||2h
os_workgroup_interval_update|i|wg:&os_workgroup_t;,deadline:k,data:&os_workgroup_interval_data_t;||2h
os_workgroup_join|i|wg:&os_workgroup_t;,token_out:&os_workgroup_join_token_t;||2g
os_workgroup_leave|v|wg:&os_workgroup_t;,token:&os_workgroup_join_token_t;||2g
os_workgroup_max_parallel_threads|i|wg:&os_workgroup_t;,attr:&os_workgroup_mpt_attr_t;||2g
os_workgroup_parallel_create|&os_workgroup_t;|name:^c,attr:&os_workgroup_attr_t;||2i
os_workgroup_set_working_arena|i|wg:&os_workgroup_t;,arena:*v,max_workers:u,destructor:p||2g
os_workgroup_testcancel|o|wg:&os_workgroup_t;||2g
panic|v|a1:^c|v|10
panic_init|v|a1:u||10
pfctlinput|v|a1:i,a2:*@struct sockaddr;||13
pid_for_task|i|t:u,x:*i||j
posix2time|$time_t;|a1:$time_t;||11
posix_spawn_file_actions_addchdir_np|i|a1:**v,a2:^c||2j
posix_spawn_file_actions_addfchdir_np|i|a1:**v,a2:i||2j
posix_spawn_file_actions_addinherit_np|i|a1:**v,a2:i||2j
posix_spawnattr_getarchpref_np|i|a1:^*v,a2:z,a3:*i,a4:*i,a5:*z||2j
posix_spawnattr_getbinpref_np|i|a1:^*v,a2:z,a3:*i,a4:*z||2j
posix_spawnattr_set_4k_page_size_np|i|a1:^*v||2j
posix_spawnattr_set_csm_np|i|attr:^*v,flags:u||2j
posix_spawnattr_setarchpref_np|i|a1:**v,a2:z,a3:*i,a4:*i,a5:*z||2j
posix_spawnattr_setauditsessionport_np|i|a1:**v,a2:u||2j
posix_spawnattr_setbinpref_np|i|a1:**v,a2:z,a3:*i,a4:*z||2j
posix_spawnattr_setexceptionports_np|i|a1:**v,a2:u,a3:u,a4:i,a5:i||2j
posix_spawnattr_setnosmt_np|i|a1:^*v||2j
posix_spawnattr_setspecialport_np|i|a1:**v,a2:u,a3:i||2j
preadv|y|a1:i,a2:^@struct iovec;,a3:i,a4:$off_t;||2k
proc_clear_dirty|i|pid:i,flags:u||2l
proc_get_dirty|i|pid:i,flags:*u||2l
proc_kmsgbuf|i|buffer:*v,buffersize:u||2l
proc_libversion|i|major:*i,minor:*i||2l
proc_listallpids|i|buffer:*v,buffersize:i||2l
proc_listchildpids|i|ppid:i,buffer:*v,buffersize:i||2l
proc_listpgrppids|i|pgrpid:i,buffer:*v,buffersize:i||2l
proc_listpids|i|type:u,typeinfo:u,buffer:*v,buffersize:i||2l
proc_listpidspath|i|type:u,typeinfo:u,path:^c,pathflags:u,buffer:*v,buffersize:i||2l
proc_name|i|pid:i,buffer:*v,buffersize:u||2l
proc_pid_rusage|i|pid:i,flavor:i,buffer:**v||2l
proc_pidfdinfo|i|pid:i,fd:i,flavor:i,buffer:*v,buffersize:i||2l
proc_pidfileportinfo|i|pid:i,fileport:u,flavor:i,buffer:*v,buffersize:i||2l
proc_pidinfo|i|pid:i,flavor:i,arg:k,buffer:*v,buffersize:i||2l
proc_pidpath|i|pid:i,buffer:*v,buffersize:u||2l
proc_pidpath_audittoken|i|audittoken:*@audit_token_t;,buffer:*v,buffersize:u||2l
proc_regionfilename|i|pid:i,address:k,buffer:*v,buffersize:u||2l
proc_set_csm|i|flags:u||2l
proc_set_dirty|i|pid:i,dirty:o||2l
proc_set_no_smt|i|||2l
proc_setpcontrol|i|control:i||2l
proc_setthread_csm|i|flags:u||2l
proc_setthread_no_smt|i|||2l
proc_signal_with_audittoken|i|audittoken:*@audit_token_t;,sig:i||2l
proc_terminate|i|pid:i,sig:*i||2l
proc_terminate_all_rsr|i|sig:i||2l
proc_terminate_with_audittoken|i|audittoken:*@audit_token_t;,sig:*i||2l
proc_track_dirty|i|pid:i,flags:u||2l
proc_udata_info|i|pid:i,flavor:i,buffer:*v,buffersize:i||2l
processor_assign|i|processor:u,new_set:u,wait:i||2m
processor_control|i|processor:u,processor_cmd:*i,processor_cmdCnt:u||2m
processor_exit|i|processor:u||2m
processor_get_assignment|i|processor:u,assigned_set:*u||2m
processor_info|i|processor:u,flavor:i,host:*u,processor_info_out:*i,processor_info_outCnt:*u||2m
processor_set_create|i|host:u,new_set:*u,new_name:*u||i
processor_set_default|i|host:u,default_set:*u||i
processor_set_destroy|i|set:u||2n
processor_set_info|i|set_name:u,flavor:i,host:*u,info_out:*i,info_outCnt:*u||2n
processor_set_max_priority|i|processor_set:u,max_priority:i,change_threads:i||2n
processor_set_policy_control|i|pset:u,flavor:i,policy_info:*i,policy_infoCnt:u,change:i||2n
processor_set_policy_disable|i|processor_set:u,policy:i,change_threads:i||2n
processor_set_policy_enable|i|processor_set:u,policy:i||2n
processor_set_stack_usage|i|pset:u,ltotal:*u,space:*z,resident:*z,maxusage:*z,maxstack:*z||2n
processor_set_statistics|i|pset:u,flavor:i,info_out:*i,info_outCnt:*u||2n
processor_set_tasks|i|processor_set:u,task_list:**u,task_listCnt:*u||2n
processor_set_tasks_with_flavor|i|processor_set:u,flavor:u,task_list:**u,task_listCnt:*u||2n
processor_set_threads|i|processor_set:u,thread_list:**u,thread_listCnt:*u||2n
processor_start|i|processor:u||2m
profil|i|a1:*c,bufsiz:z,a3:m,a4:u||n
psort|v|base:*v,nel:z,width:z,compar:p||s
psort_b|v|base:*v,nel:z,width:z,compar:p||s
psort_r|v|base:*v,nel:z,width:z,a4:*v,compar:p||s
pthread_attr_get_qos_class_np|i|attr:*@__darwin_pthread_attr_t;,qos_class:*u,relative_priority:*i||2o
pthread_attr_set_qos_class_np|i|attr:*@__darwin_pthread_attr_t;,qos_class:u,relative_priority:i||2o
pthread_cond_signal_thread_np|i|a1:*@__darwin_pthread_cond_t;,a2:m||2p
pthread_cond_timedwait_relative_np|i|cv:*@__darwin_pthread_cond_t;,external_mutex:*@__darwin_pthread_mutex_t;,t:^@struct timespec;||2p
pthread_cpu_number_np|i|cpu_number_out:*z||2p
pthread_create_suspended_np|i|a1:*m,a2:^@__darwin_pthread_attr_t;,a3:p,a4:*v||2p
pthread_from_mach_thread_np|m|a1:u||2p
pthread_get_qos_class_np|i|pthread:m,qos_class:*u,relative_priority:*i||2o
pthread_get_stackaddr_np|*v|a1:m||2p
pthread_get_stacksize_np|z|a1:m||2p
pthread_getname_np|i|thread:m,name:*c,len:z||2p
pthread_getugid_np|i|a1:*u,a2:*u||n
pthread_is_threaded_np|i|||2p
pthread_jit_write_freeze_callbacks_np|v|||2p
pthread_jit_write_protect_np|v|enabled:i||2p
pthread_jit_write_protect_supported_np|i|||2p
pthread_jit_write_with_callback_np|i|callback:p,ctx:*v||2p
pthread_mach_thread_np|u|a1:m||2p
pthread_main_np|i|||2p
pthread_override_qos_class_end_np|i|override:&pthread_override_t;||2o
pthread_override_qos_class_start_np|&pthread_override_t;|pthread:m,qos_class:u,relative_priority:i||2o
pthread_set_qos_class_self_np|i|qos_class:u,relative_priority:i||2o
pthread_setname_np|i|a1:^c||2p
pthread_setugid_np|i|a1:u,a2:u||n
pthread_threadid_np|i|a1:m,a2:*k||2p
pthread_yield_np|v|||2p
ptrace|i|request:i,pid:i,addr:*c,data:i||2q
ptsname_r|i|fildes:i,buffer:*c,buflen:z||s
putw|i|ch:i,file:*@FILE;||h
pwritev|y|a1:i,a2:^@struct iovec;,a3:i,a4:$off_t;||2k
qos_class_main|u|||2r
qos_class_self|u|||2r
qsort_b|v|base:*v,nel:z,width:z,compar:p||s
qsort_r|v|base:*v,nel:z,width:z,a4:*v,compar:p||s
radixsort|i|base:*^h,nel:i,table:^h,endbyte:u||s
rcmd|i|a1:**c,a2:i,a3:^c,a4:^c,a5:^c,a6:*i||n
rcmd_af|i|a1:**c,a2:i,a3:^c,a4:^c,a5:^c,a6:*i,a7:i||n
reallocf|*v|ptr:*v,size:z|a1|2s
reboot|i|a1:i||n
regncomp|i|a1:*@regex_t;,a2:^c,len:z,a4:i||2t
regnexec|i|a1:^@regex_t;,a2:^c,len:z,nmatch:z,pmatch:*@regmatch_t;,a6:i||2t
regwcomp|i|a1:*@regex_t;,a2:^w,a3:i||2t
regwexec|i|a1:^@regex_t;,a2:^w,nmatch:z,pmatch:*@regmatch_t;,a5:i||2t
regwncomp|i|a1:*@regex_t;,a2:^w,len:z,a4:i||2t
regwnexec|i|a1:^@regex_t;,a2:^w,len:z,nmatch:z,pmatch:*@regmatch_t;,a6:i||2t
renameatx_np|i|a1:i,a2:^c,a3:i,a4:^c,a5:u||2u
renamex_np|i|a1:^c,a2:^c,a3:u||2u
revoke|i|a1:^c||n
rindex|*c|a1:^c,a2:i||w
rpmatch|i|a1:^c||s
rresvport|i|a1:*i||n
rresvport_af|i|a1:*i,a2:i||n
ruserok|i|a1:^c,a2:i,a3:^c,a4:^c||n
sbrk|*v|a1:i||n
scandirat|i|a1:i,a2:^c,a3:***@struct dirent;,a4:p,a5:p||f
scandirat_b|i|a1:i,a2:^c,a3:***@struct dirent;,a4:p,a5:p||f
searchfs|i|a1:^c,a2:*@struct fssearchblock;,a3:*m,a4:u,a5:u,a6:*@struct searchstate;||n
semaphore_create|i|task:u,semaphore:*u,policy:i,value:i||20
semaphore_destroy|i|task:u,semaphore:u||20
semaphore_signal|i|semaphore:u||2v
semaphore_signal_all|i|semaphore:u||2v
semaphore_signal_thread|i|semaphore:u,thread:u||2v
semaphore_wait|i|semaphore:u||2v
semaphore_wait_signal|i|wait_semaphore:u,signal_semaphore:u||2v
semsys|i|a1:i|v|2w
sendfile|i|a1:i,a2:i,a3:$off_t;,a4:*$off_t;,a5:*@struct sf_hdtr;,a6:i||13
setattrlist|i|a1:^c,a2:*v,a3:*v,attrBufSize:z,a5:u||n
setattrlistat|i|a1:i,a2:^c,a3:*v,a4:*v,a5:z,a6:u||1l
setaudit|i|a1:^@struct auditinfo;||t
setaudit_addr|i|a1:^@struct auditinfo_addr;,a2:i||t
setauid|i|a1:^u||t
setbuffer|v|a1:*@FILE;,a2:*c,size:i||h
setdomainname|i|a1:^c,namelen:i||n
setgrfile|v|a1:^c||1p
setgroupent|i|a1:i||1p
setgroups|i|a1:i,a2:^u||n
sethostid|v|a1:l||n
sethostname|i|name:^c,namelen:i||n
setiopolicy_np|i|a1:i,a2:i,a3:i||1r
setlinebuf|i|a1:*@FILE;||h
setlogin|i|a1:^c||n
setmode|*v|a1:^c||n
setnetgrent|v|a1:^c||1h
setpassent|i|a1:i||1t
setprogname|v|a1:^c||s
setrgid|i|a1:u||n
setrpcent|v|stayopen:i||1h
setruid|i|a1:u||n
setsgroups_np|i|a1:i,a2:^h||n
setsourcefilter|i|a1:i,a2:u,a3:*@struct sockaddr;,a4:u,a5:u,a6:u,a7:*@struct sockaddr_storage;||x
settimeofday|i|tp:^@struct timeval;,tzp:^@struct timezone;||q
setusershell|v|||n
setwgroups_np|i|a1:i,a2:^h||n
shmsys|i|a1:i|v|2x
sigblock|i|a1:i||g
sigsetmask|i|a1:i||g
sigvec|i|a1:i,a2:*@struct sigvec;,a3:*@struct sigvec;||g
slot_name|v|a1:i,a2:i,a3:**c,a4:**c||10
sradixsort|i|base:*^h,nel:i,table:^h,endbyte:u||s
sranddev|v|||s
srandomdev|v|||s
statfs|i|a1:^c,a2:*@struct statfs;||1j
statx_np|i|a1:^c,a2:*@struct stat;,a3:&filesec_t;||z
strcasestr|*c|big:^c,little:^c||2a
strchrnul|*c|s:^c,c:i||2a
strlcat|m|dst:*c,source:^c,size:z||2a
strlcpy|m|dst:*c,source:^c,size:z||2a
strmode|v|mode:i,bp:*c||2a
strnstr|*c|big:^c,little:^c,len:z||2a
strsep|*c|stringp:**c,delim:^c||2a
strsignal_r|i|sig:i,strsignalbuf:*c,buflen:z||2a
strtofflags|i|a1:**c,a2:*m,a3:*m||n
strtonum|q|numstr:^c,minval:q,maxval:q,errstrp:*^c||s
strtoq|q|str:^c,endptr:**c,base:i||s
strtouq|r|str:^c,endptr:**c,base:i||s
swapon|i|a1:^c||n
swtch|i|||j
swtch_pri|i|pri:i||j
sync_volume_np|i|a1:^c,a2:i||n
syscall|i|a1:i|v|n
sysctl|i|name:*i,namelen:u,oldp:*v,oldlenp:*z,newp:*v,newlen:z||2y
sysctlbyname|i|name:^c,oldp:*v,oldlenp:*z,newp:*v,newlen:z||2y
sysctlnametomib|i|name:^c,mibp:*i,sizep:*z||2y
task_assign|i|task:u,new_set:u,assign_threads:i||20
task_assign_default|i|task:u,assign_threads:i||20
task_create|i|target_task:u,ledgers:*u,ledgersCnt:u,inherit_memory:i,child_task:*u||20
task_create_identity_token|i|task:u,token:*u||20
task_dyld_process_info_notify_deregister|i|target_task:u,notify:u||20
task_dyld_process_info_notify_get|i|names_addr:*u,names_count_addr:*u||j
task_dyld_process_info_notify_register|i|target_task:u,notify:u||20
task_for_pid|i|target_tport:u,pid:i,t:*u||j
task_generate_corpse|i|task:u,corpse_task_port:*u||20
task_get_assignment|i|task:u,assigned_set:*u||20
task_get_dyld_image_infos|i|task:u,dyld_images:*&dyld_kernel_image_info_array_t;,dyld_imagesCnt:*u||20
task_get_exc_guard_behavior|i|task:u,behavior:*u||20
task_get_exception_ports|i|task:u,exception_mask:u,masks:*u,masksCnt:*u,old_handlers:*u,old_behaviors:*i,old_flavors:*i||20
task_get_exception_ports_info|i|port:u,exception_mask:u,masks:*u,masksCnt:*u,old_handlers_info:&exception_handler_info_array_t;,old_behaviors:*i,old_flavors:*i||20
task_get_mach_voucher|i|task:u,which:u,voucher:*u||20
task_get_special_port|i|task:u,which_port:i,special_port:*u||20
task_get_state|i|task:u,flavor:i,old_state:*u,old_stateCnt:*u||20
task_identity_token_get_task_port|i|token:u,flavor:u,task_port:*u||20
task_info|i|target_task:u,flavor:u,task_info_out:*i,task_info_outCnt:*u||20
task_inspect|i|task:u,flavor:u,info_out:*i,info_outCnt:*u||20
task_map_corpse_info|i|task:u,corspe_task:u,kcd_addr_begin:*z,kcd_size:*u||20
task_map_corpse_info_64|i|task:u,corspe_task:u,kcd_addr_begin:*k,kcd_size:*k||20
task_map_kcdata_object_64|i|task:u,kcdata_object:u,kcd_addr_begin:*k,kcd_size:*k||20
task_name_for_pid|i|target_tport:u,pid:i,tn:*u||j
task_policy|i|task:u,policy:i,base:*i,baseCnt:u,set_limit:i,change:i||20
task_policy_get|i|task:u,flavor:u,policy_info:*i,policy_infoCnt:*u,get_default:*i||20
task_policy_set|i|task:u,flavor:u,policy_info:*i,policy_infoCnt:u||20
task_purgable_info|i|task:u,stats:*@task_purgable_info_t;||20
task_register_dyld_get_process_state|i|task:u,dyld_process_state:*@dyld_kernel_process_info_t;||20
task_register_dyld_image_infos|i|task:u,dyld_images:&dyld_kernel_image_info_array_t;,dyld_imagesCnt:u||20
task_register_dyld_set_dyld_state|i|task:u,dyld_state:h||20
task_register_hardened_exception_handler|i|task:u,signed_pc_key:u,exceptions_allowed:u,behaviors_allowed:i,flavors_allowed:i,new_exception_port:u||20
task_resume|i|target_task:u||20
task_resume2|i|suspend_token:u||20
task_sample|i|task:u,reply:u||20
task_self_trap|u|||j
task_set_corpse_forking_behavior|i|task:u,behavior:u||20
task_set_emulation|i|target_port:u,routine_entry_pt:z,routine_number:i||20
task_set_exc_guard_behavior|i|task:u,behavior:u||20
task_set_exception_ports|i|task:u,exception_mask:u,new_port:u,behavior:i,new_flavor:i||20
task_set_info|i|target_task:u,flavor:u,task_info_in:*i,task_info_inCnt:u||20
task_set_mach_voucher|i|task:u,voucher:u||20
task_set_phys_footprint_limit|i|task:u,new_limit:i,old_limit:*i||20
task_set_policy|i|task:u,pset:u,policy:i,base:*i,baseCnt:u,limit:*i,limitCnt:u,change:i||20
task_set_port_space|i|task:u,table_entries:i||26
task_set_ras_pc|i|target_task:u,basepc:z,boundspc:z||20
task_set_special_port|i|task:u,which_port:i,special_port:u||20
task_set_state|i|task:u,flavor:i,new_state:*u,new_stateCnt:u||20
task_suspend|i|target_task:u||20
task_suspend2|i|target_task:u,suspend_token:*u||20
task_swap_exception_ports|i|task:u,exception_mask:u,new_port:u,behavior:i,new_flavor:i,masks:*u,masksCnt:*u,old_handlers:*u,old_behaviors:*i,old_flavors:*i||20
task_swap_mach_voucher|i|task:u,new_voucher:u,old_voucher:*u||20
task_terminate|i|target_task:u||20
task_test_async_upcall_propagation|i|task:u,port:u,qos:i,iotier:i||20
task_test_sync_upcall|i|task:u,port:u||20
task_threads|i|target_task:u,act_list:**u,act_listCnt:*u||20
task_unregister_dyld_image_infos|i|task:u,dyld_images:&dyld_kernel_image_info_array_t;,dyld_imagesCnt:u||20
task_wire|i|target_task:u,must_wire:i||24
task_zone_info|i|target_task:u,names:*&mach_zone_name_array_t;,namesCnt:*u,info:*&task_zone_info_array_t;,infoCnt:*u||20
thread_abort|i|target_act:u||o
thread_abort_safely|i|target_act:u||o
thread_adopt_exception_handler|i|thread:u,exc_port:u,exc_mask:u,behavior_mask:i,flavor_mask:i||o
thread_assign|i|thread:u,new_set:u||o
thread_assign_default|i|thread:u||o
thread_convert_thread_state|i|thread:u,direction:i,flavor:i,in_state:*u,in_stateCnt:u,out_state:*u,out_stateCnt:*u||o
thread_create|i|parent_task:u,child_act:*u||20
thread_create_running|i|parent_task:u,flavor:i,new_state:*u,new_stateCnt:u,child_act:*u||20
thread_depress_abort|i|thread:u||o
thread_get_assignment|i|thread:u,assigned_set:*u||o
thread_get_exception_ports|i|thread:u,exception_mask:u,masks:*u,masksCnt:*u,old_handlers:*u,old_behaviors:*i,old_flavors:*i||o
thread_get_exception_ports_info|i|port:u,exception_mask:u,masks:*u,masksCnt:*u,old_handlers_info:&exception_handler_info_array_t;,old_behaviors:*i,old_flavors:*i||o
thread_get_mach_voucher|i|thr_act:u,which:u,voucher:*u||o
thread_get_special_port|i|thr_act:u,which_port:i,special_port:*u||o
thread_get_state|i|target_act:u,flavor:i,old_state:*u,old_stateCnt:*u||o
thread_info|i|target_act:u,flavor:u,thread_info_out:*i,thread_info_outCnt:*u||o
thread_policy|i|thr_act:u,policy:i,base:*i,baseCnt:u,set_limit:i||o
thread_policy_get|i|thread:u,flavor:u,policy_info:*i,policy_infoCnt:*u,get_default:*i||o
thread_policy_set|i|thread:u,flavor:u,policy_info:*i,policy_infoCnt:u||o
thread_resume|i|target_act:u||o
thread_resume2|i|suspend_token:u||o
thread_sample|i|thread:u,reply:u||o
thread_set_exception_ports|i|thread:u,exception_mask:u,new_port:u,behavior:i,new_flavor:i||o
thread_set_mach_voucher|i|thr_act:u,voucher:u||o
thread_set_policy|i|thr_act:u,pset:u,policy:i,base:*i,baseCnt:u,limit:*i,limitCnt:u||o
thread_set_special_port|i|thr_act:u,which_port:i,special_port:u||o
thread_set_state|i|target_act:u,flavor:i,new_state:*u,new_stateCnt:u||o
thread_set_x86_64_compat|i|enable:u||j
thread_suspend|i|target_act:u||o
thread_suspend2|i|target_act:u,suspend_token:*u||o
thread_swap_exception_ports|i|thread:u,exception_mask:u,new_port:u,behavior:i,new_flavor:i,masks:*u,masksCnt:*u,old_handlers:*u,old_behaviors:*i,old_flavors:*i||o
thread_swap_mach_voucher|i|thr_act:u,new_voucher:u,old_voucher:*u||o
thread_switch|i|thread_name:u,option:i,option_time:u||j
thread_terminate|i|target_act:u||o
thread_wire|i|host_priv:u,thread:u,wired:i||1u
time2posix|$time_t;|a1:$time_t;||11
timegm|$time_t;|tm:*@struct tm;||11
timelocal|$time_t;|a1:*@struct tm;||11
timingsafe_bcmp|i|b1:^v,b2:^v,len:z||2a
ttyslot|i|||n
tzsetwall|v|||11
umaskx_np|i|a1:&filesec_t;||z
undelete|i|a1:^c||n
unmount|i|a1:^c,a2:i||1j
unwhiteout|i|a1:^c||n
user_from_uid|*c|a1:u,a2:i||1t
uuid_clear|v|uu:*h||2z
uuid_compare|i|uu1:^h,uu2:^h||2z
uuid_copy|v|dst:*h,src:^h||2z
uuid_generate|v|out:*h||2z
uuid_generate_random|v|out:*h||2z
uuid_generate_time|v|out:*h||2z
uuid_is_null|i|uu:^h||2z
uuid_parse|i|in:^c,uu:*h||2z
uuid_unparse|v|uu:^h,out:*c||2z
uuid_unparse_lower|v|uu:^h,out:*c||2z
uuid_unparse_upper|v|uu:^h,out:*c||2z
valloc|*v|size:z|a0|2s
vasprintf|i|strp:**c,fmt:^c,ap:x||h
vm_allocate|i|target_task:u,address:*z,size:z,flags:i||24
vm_allocate_cpm|i|host_priv:u,task:u,address:*z,size:z,flags:i||1u
vm_behavior_set|i|target_task:u,address:z,size:z,new_behavior:i||24
vm_copy|i|target_task:u,source_address:z,size:z,dest_address:z||24
vm_deallocate|i|target_task:u,address:z,size:z||24
vm_inherit|i|target_task:u,address:z,size:z,new_inheritance:u||24
vm_machine_attribute|i|target_task:u,address:z,size:z,attribute:u,value:*i||24
vm_map|i|target_task:u,address:*z,size:z,mask:z,flags:i,object:u,offset:z,copy:i,cur_protection:i,max_protection:i,inheritance:u||24
vm_map_64|i|target_task:u,address:*z,size:z,mask:z,flags:i,object:u,offset:r,copy:i,cur_protection:i,max_protection:i,inheritance:u||24
vm_map_exec_lockdown|i|target_task:u||24
vm_map_page_query|i|target_map:u,offset:z,disposition:*i,ref_count:*i||24
vm_mapped_pages_info|i|task:u,pages:**z,pagesCnt:*u||24
vm_msync|i|target_task:u,address:z,size:z,sync_flags:u||24
vm_protect|i|target_task:u,address:z,size:z,set_maximum:i,new_protection:i||24
vm_purgable_control|i|target_task:u,address:z,control:i,state:*i||24
vm_read|i|target_task:u,address:z,size:z,data:*z,dataCnt:*u||24
vm_read_list|i|target_task:u,data_list:*@struct vm_read_entry;,count:u||24
vm_read_overwrite|i|target_task:u,address:z,size:z,data:z,outsize:*z||24
vm_reallocate|i|target_task:u,src:z,src_size:z,dst:*z,dst_size:z,align_mask:z,options:i,flags:i||24
vm_region|i|target_task:u,address:*z,size:*z,flavor:i,info:*i,infoCnt:*u,object_name:*u||24
vm_region_64|i|target_task:u,address:*z,size:*z,flavor:i,info:*i,infoCnt:*u,object_name:*u||24
vm_region_recurse|i|target_task:u,address:*z,size:*z,nesting_depth:*u,info:*i,infoCnt:*u||24
vm_region_recurse_64|i|target_task:u,address:*z,size:*z,nesting_depth:*u,info:*i,infoCnt:*u||24
vm_remap|i|target_task:u,target_address:*z,size:z,mask:z,flags:i,src_task:u,src_address:z,copy:i,cur_protection:*i,max_protection:*i,inheritance:u||24
vm_remap_new|i|target_task:u,target_address:*z,size:z,mask:z,flags:i,src_task:u,src_address:z,copy:i,cur_protection:*i,max_protection:*i,inheritance:u||24
vm_wire|i|host_priv:u,task:u,address:z,size:z,desired_access:i||1u
vm_write|i|target_task:u,address:z,data:z,dataCnt:u||24
voucher_mach_msg_adopt|&voucher_mach_msg_state_t;|msg:*@mach_msg_header_t;||10
voucher_mach_msg_clear|v|msg:*@mach_msg_header_t;||10
voucher_mach_msg_revert|v|state:&voucher_mach_msg_state_t;||10
voucher_mach_msg_set|i|msg:*@mach_msg_header_t;||10
vsyslog|v|a1:i,a2:^c,a3:x||30
wait3|i|a1:*i,a2:i,a3:*@struct rusage;||31
wait4|i|pid:i,stat_loc:*i,options:i,rusage:*@struct rusage;||31
wcslcat|z|a1:*w,a2:^w,len:z||1i
wcslcpy|z|a1:*w,a2:^w,len:z||1i
xpc_activity_copy_criteria|*v|activity:&xpc_activity_t;||32
xpc_activity_get_state|l|activity:&xpc_activity_t;||32
xpc_activity_register|v|identifier:^c,criteria:*v,handler:p||32
xpc_activity_set_criteria|v|activity:&xpc_activity_t;,criteria:*v||32
xpc_activity_set_state|o|activity:&xpc_activity_t;,state:l||32
xpc_activity_should_defer|o|activity:&xpc_activity_t;||32
xpc_activity_unregister|v|identifier:^c||32
xpc_array_append_value|v|xarray:*v,value:*v||33
xpc_array_apply|o|xarray:*v,applier:p||33
xpc_array_create|*v|objects:^*v,count:z||33
xpc_array_create_connection|&xpc_connection_t;|xarray:*v,index:z||33
xpc_array_create_empty|*v|||33
xpc_array_dup_fd|i|xarray:*v,index:z||33
xpc_array_get_array|*v|xarray:*v,index:z||33
xpc_array_get_bool|o|xarray:*v,index:z||33
xpc_array_get_count|z|xarray:*v||33
xpc_array_get_data|^v|xarray:*v,index:z,length:*z||33
xpc_array_get_date|j|xarray:*v,index:z||33
xpc_array_get_dictionary|*v|xarray:*v,index:z||33
xpc_array_get_double|d|xarray:*v,index:z||33
xpc_array_get_int64|j|xarray:*v,index:z||33
xpc_array_get_string|^c|xarray:*v,index:z||33
xpc_array_get_uint64|k|xarray:*v,index:z||33
xpc_array_get_uuid|^h|xarray:*v,index:z||33
xpc_array_get_value|*v|xarray:*v,index:z||33
xpc_array_set_bool|v|xarray:*v,index:z,value:o||33
xpc_array_set_connection|v|xarray:*v,index:z,connection:&xpc_connection_t;||33
xpc_array_set_data|v|xarray:*v,index:z,bytes:^v,length:z||33
xpc_array_set_date|v|xarray:*v,index:z,value:j||33
xpc_array_set_double|v|xarray:*v,index:z,value:d||33
xpc_array_set_fd|v|xarray:*v,index:z,fd:i||33
xpc_array_set_int64|v|xarray:*v,index:z,value:j||33
xpc_array_set_string|v|xarray:*v,index:z,string:^c||33
xpc_array_set_uint64|v|xarray:*v,index:z,value:k||33
xpc_array_set_uuid|v|xarray:*v,index:z,uuid:^h||33
xpc_array_set_value|v|xarray:*v,index:z,value:*v||33
xpc_bool_create|*v|value:o||33
xpc_bool_get_value|o|xbool:*v||33
xpc_connection_activate|v|connection:&xpc_connection_t;||34
xpc_connection_cancel|v|connection:&xpc_connection_t;||34
xpc_connection_copy_invalidation_reason|*c|connection:&xpc_connection_t;||34
xpc_connection_create|&xpc_connection_t;|name:^c,targetq:&dispatch_queue_t;||34
xpc_connection_create_from_endpoint|&xpc_connection_t;|endpoint:&xpc_endpoint_t;||34
xpc_connection_create_mach_service|&xpc_connection_t;|name:^c,targetq:&dispatch_queue_t;,flags:k||34
xpc_connection_get_asid|i|connection:&xpc_connection_t;||34
xpc_connection_get_context|*v|connection:&xpc_connection_t;||34
xpc_connection_get_egid|u|connection:&xpc_connection_t;||34
xpc_connection_get_euid|u|connection:&xpc_connection_t;||34
xpc_connection_get_name|^c|connection:&xpc_connection_t;||34
xpc_connection_get_pid|i|connection:&xpc_connection_t;||34
xpc_connection_resume|v|connection:&xpc_connection_t;||34
xpc_connection_send_barrier|v|connection:&xpc_connection_t;,barrier:p||34
xpc_connection_send_message|v|connection:&xpc_connection_t;,message:*v||34
xpc_connection_send_message_with_reply|v|connection:&xpc_connection_t;,message:*v,replyq:&dispatch_queue_t;,handler:p||34
xpc_connection_send_message_with_reply_sync|*v|connection:&xpc_connection_t;,message:*v||34
xpc_connection_set_context|v|connection:&xpc_connection_t;,context:*v||34
xpc_connection_set_event_handler|v|connection:&xpc_connection_t;,handler:p||34
xpc_connection_set_finalizer_f|v|connection:&xpc_connection_t;,finalizer:p||34
xpc_connection_set_peer_code_signing_requirement|i|connection:&xpc_connection_t;,requirement:^c||34
xpc_connection_set_peer_entitlement_exists_requirement|i|connection:&xpc_connection_t;,entitlement:^c||34
xpc_connection_set_peer_entitlement_matches_value_requirement|i|connection:&xpc_connection_t;,entitlement:^c,value:*v||34
xpc_connection_set_peer_lightweight_code_requirement|i|connection:&xpc_connection_t;,lwcr:*v||34
xpc_connection_set_peer_platform_identity_requirement|i|connection:&xpc_connection_t;,signing_identifier:^c||34
xpc_connection_set_peer_requirement|v|connection:&xpc_connection_t;,peer_requirement:&xpc_peer_requirement_t;||34
xpc_connection_set_peer_team_identity_requirement|i|connection:&xpc_connection_t;,signing_identifier:^c||34
xpc_connection_set_target_queue|v|connection:&xpc_connection_t;,targetq:&dispatch_queue_t;||34
xpc_connection_suspend|v|connection:&xpc_connection_t;||34
xpc_copy|*v|object:*v||33
xpc_copy_description|*c|object:*v||33
xpc_data_create|*v|bytes:^v,length:z||33
xpc_data_create_with_dispatch_data|*v|ddata:&dispatch_data_t;||33
xpc_data_get_bytes|z|xdata:*v,buffer:*v,off:z,length:z||33
xpc_data_get_bytes_ptr|^v|xdata:*v||33
xpc_data_get_length|z|xdata:*v||33
xpc_date_create|*v|interval:j||33
xpc_date_create_from_current|*v|||33
xpc_date_get_value|j|xdate:*v||33
xpc_debugger_api_misuse_info|^c|||35
xpc_dictionary_apply|o|xdict:*v,applier:p||33
xpc_dictionary_copy_mach_send|u|xdict:*v,key:^c||33
xpc_dictionary_create|*v|keys:^^c,values:^*v,count:z||33
xpc_dictionary_create_connection|&xpc_connection_t;|xdict:*v,key:^c||33
xpc_dictionary_create_empty|*v|||33
xpc_dictionary_create_reply|*v|original:*v||33
xpc_dictionary_dup_fd|i|xdict:*v,key:^c||33
xpc_dictionary_get_array|*v|xdict:*v,key:^c||33
xpc_dictionary_get_bool|o|xdict:*v,key:^c||33
xpc_dictionary_get_count|z|xdict:*v||33
xpc_dictionary_get_data|^v|xdict:*v,key:^c,length:*z||33
xpc_dictionary_get_date|j|xdict:*v,key:^c||33
xpc_dictionary_get_dictionary|*v|xdict:*v,key:^c||33
xpc_dictionary_get_double|d|xdict:*v,key:^c||33
xpc_dictionary_get_int64|j|xdict:*v,key:^c||33
xpc_dictionary_get_remote_connection|&xpc_connection_t;|xdict:*v||33
xpc_dictionary_get_string|^c|xdict:*v,key:^c||33
xpc_dictionary_get_uint64|k|xdict:*v,key:^c||33
xpc_dictionary_get_uuid|^h|xdict:*v,key:^c||33
xpc_dictionary_get_value|*v|xdict:*v,key:^c||33
xpc_dictionary_set_bool|v|xdict:*v,key:^c,value:o||33
xpc_dictionary_set_connection|v|xdict:*v,key:^c,connection:&xpc_connection_t;||33
xpc_dictionary_set_data|v|xdict:*v,key:^c,bytes:^v,length:z||33
xpc_dictionary_set_date|v|xdict:*v,key:^c,value:j||33
xpc_dictionary_set_double|v|xdict:*v,key:^c,value:d||33
xpc_dictionary_set_fd|v|xdict:*v,key:^c,fd:i||33
xpc_dictionary_set_int64|v|xdict:*v,key:^c,value:j||33
xpc_dictionary_set_mach_send|v|xdict:*v,key:^c,p:u||33
xpc_dictionary_set_string|v|xdict:*v,key:^c,string:^c||33
xpc_dictionary_set_uint64|v|xdict:*v,key:^c,value:k||33
xpc_dictionary_set_uuid|v|xdict:*v,key:^c,uuid:^h||33
xpc_dictionary_set_value|v|xdict:*v,key:^c,value:*v||33
xpc_double_create|*v|value:d||33
xpc_double_get_value|d|xdouble:*v||33
xpc_endpoint_create|&xpc_endpoint_t;|connection:&xpc_connection_t;||36
xpc_equal|o|object1:*v,object2:*v||33
xpc_fd_create|*v|fd:i||33
xpc_fd_dup|i|xfd:*v||33
xpc_get_type|&xpc_type_t;|object:*v||33
xpc_hash|z|object:*v||33
xpc_int64_create|*v|value:j||33
xpc_int64_get_value|j|xint:*v||33
xpc_listener_activate|o|listener:&xpc_listener_t;,error_out:*&xpc_rich_error_t;||37
xpc_listener_cancel|v|listener:&xpc_listener_t;||37
xpc_listener_copy_description|*c|listener:&xpc_listener_t;||37
xpc_listener_create|&xpc_listener_t;|service:^c,target_queue:&dispatch_queue_t;,flags:u,incoming_session_handler:p,error_out:*&xpc_rich_error_t;||37
xpc_listener_reject_peer|v|peer:&xpc_session_t;,reason:^c||37
xpc_listener_set_peer_code_signing_requirement|i|listener:&xpc_listener_t;,requirement:^c||37
xpc_listener_set_peer_requirement|v|listener:&xpc_listener_t;,requirement:&xpc_peer_requirement_t;||37
xpc_main|v|handler:p|n|33
xpc_null_create|*v|||33
xpc_peer_requirement_create_entitlement_exists|&xpc_peer_requirement_t;|entitlement:^c,error_out:*&xpc_rich_error_t;||38
xpc_peer_requirement_create_entitlement_matches_value|&xpc_peer_requirement_t;|entitlement:^c,value:*v,error_out:*&xpc_rich_error_t;||38
xpc_peer_requirement_create_lwcr|&xpc_peer_requirement_t;|lwcr:*v,error_out:*&xpc_rich_error_t;||38
xpc_peer_requirement_create_platform_identity|&xpc_peer_requirement_t;|signing_identifier:^c,error_out:*&xpc_rich_error_t;||38
xpc_peer_requirement_create_team_identity|&xpc_peer_requirement_t;|signing_identifier:^c,error_out:*&xpc_rich_error_t;||38
xpc_peer_requirement_match_received_message|o|peer_requirement:&xpc_peer_requirement_t;,message:*v,error_out:*&xpc_rich_error_t;||38
xpc_release|v|object:*v||33
xpc_retain|*v|object:*v||33
xpc_rich_error_can_retry|o|error:&xpc_rich_error_t;||39
xpc_rich_error_copy_description|*c|error:&xpc_rich_error_t;||39
xpc_session_activate|o|session:&xpc_session_t;,error_out:*&xpc_rich_error_t;||3a
xpc_session_cancel|v|session:&xpc_session_t;||3a
xpc_session_copy_description|*c|session:&xpc_session_t;||3a
xpc_session_create_mach_service|&xpc_session_t;|mach_service:^c,target_queue:&dispatch_queue_t;,flags:u,error_out:*&xpc_rich_error_t;||3a
xpc_session_create_xpc_service|&xpc_session_t;|name:^c,target_queue:&dispatch_queue_t;,flags:u,error_out:*&xpc_rich_error_t;||3a
xpc_session_send_message|&xpc_rich_error_t;|session:&xpc_session_t;,message:*v||3a
xpc_session_send_message_with_reply_async|v|session:&xpc_session_t;,message:*v,reply_handler:p||3a
xpc_session_send_message_with_reply_sync|*v|session:&xpc_session_t;,message:*v,error_out:*&xpc_rich_error_t;||3a
xpc_session_set_cancel_handler|v|session:&xpc_session_t;,cancel_handler:p||3a
xpc_session_set_incoming_message_handler|v|session:&xpc_session_t;,handler:p||3a
xpc_session_set_peer_code_signing_requirement|i|session:&xpc_session_t;,requirement:^c||3a
xpc_session_set_peer_requirement|v|session:&xpc_session_t;,requirement:&xpc_peer_requirement_t;||3a
xpc_session_set_target_queue|v|session:&xpc_session_t;,target_queue:&dispatch_queue_t;||3a
xpc_set_event_stream_handler|v|stream:^c,targetq:&dispatch_queue_t;,handler:p||33
xpc_shmem_create|*v|region:*v,length:z||33
xpc_shmem_map|z|xshmem:*v,region:**v||33
xpc_string_create|*v|string:^c||33
xpc_string_create_with_format|*v|fmt:^c|vf0|33
xpc_string_create_with_format_and_arguments|*v|fmt:^c,ap:x||33
xpc_string_get_length|z|xstring:*v||33
xpc_string_get_string_ptr|^c|xstring:*v||33
xpc_transaction_begin|v|||33
xpc_transaction_end|v|||33
xpc_type_get_name|^c|type:&xpc_type_t;||33
xpc_uint64_create|*v|value:k||33
xpc_uint64_get_value|k|xuint:*v||33
xpc_uuid_create|*v|uuid:^h||33
xpc_uuid_get_bytes|^h|xuuid:*v||33
=CCrfc3394_iv|^h|c|3
=CCrfc3394_ivLen|z|c|3
=XPC_ACTIVITY_ALLOW_BATTERY|^c|c|32
=XPC_ACTIVITY_CHECK_IN|*v|c|32
=XPC_ACTIVITY_DELAY|^c|c|32
=XPC_ACTIVITY_GRACE_PERIOD|^c|c|32
=XPC_ACTIVITY_INTERVAL|^c|c|32
=XPC_ACTIVITY_INTERVAL_15_MIN|j|c|32
=XPC_ACTIVITY_INTERVAL_1_DAY|j|c|32
=XPC_ACTIVITY_INTERVAL_1_HOUR|j|c|32
=XPC_ACTIVITY_INTERVAL_1_MIN|j|c|32
=XPC_ACTIVITY_INTERVAL_30_MIN|j|c|32
=XPC_ACTIVITY_INTERVAL_4_HOURS|j|c|32
=XPC_ACTIVITY_INTERVAL_5_MIN|j|c|32
=XPC_ACTIVITY_INTERVAL_7_DAYS|j|c|32
=XPC_ACTIVITY_INTERVAL_8_HOURS|j|c|32
=XPC_ACTIVITY_PREVENT_DEVICE_SLEEP|^c|c|32
=XPC_ACTIVITY_PRIORITY|^c|c|32
=XPC_ACTIVITY_PRIORITY_MAINTENANCE|^c|c|32
=XPC_ACTIVITY_PRIORITY_UTILITY|^c|c|32
=XPC_ACTIVITY_REPEATING|^c|c|32
=XPC_ACTIVITY_REQUIRE_BATTERY_LEVEL|^c|c|32
=XPC_ACTIVITY_REQUIRE_HDD_SPINNING|^c|c|32
=XPC_ACTIVITY_REQUIRE_SCREEN_SLEEP|^c|c|32
=__mb_cur_max|i||s
=__stderrp|*@FILE;||h
=__stdinp|*@FILE;||h
=__stdoutp|*@FILE;||h
=_dispatch_data_destructor_free|p|c|18
=_dispatch_data_destructor_munmap|p|c|18
=_xpc_error_key_description|^c|c|33
=_xpc_event_key_name|^c|c|33
=bootstrap_port|u||1v
=mach_task_self_|u||1v
=optreset|i||n
=suboptarg|*c||s
=sys_nerr|i|c|h
=vm_kernel_page_mask|z||3b
=vm_kernel_page_shift|i||3b
=vm_kernel_page_size|z||3b
=vm_page_mask|z||3b
=vm_page_shift|i||3b
=vm_page_size|z||3b
=vprintf_stderr_func|p||1v
`;var Dr=Object.freeze({__proto__:null,data:vr,headers:Nr,provenance:yr});const Lr="scripts/library-prototypes/glibc.h (glibc 2.39 ABI)",br=["glibc.h"],Or=`__asprintf_chk|i|result:**c,flag:i,format:^c|vf2|0
__assert_fail|v|assertion:^c,file:^c,line:u,function:^c|n|0
__assert_perror_fail|v|errnum:i,file:^c,line:u,function:^c|n|0
__chk_fail|v||n|0
__ctype_b_loc|*^t|||0
__ctype_get_mb_cur_max|z|||0
__ctype_tolower_loc|*^i|||0
__ctype_toupper_loc|*^i|||0
__dprintf_chk|i|fd:i,flag:i,format:^c|vf2|0
__errno_location|*i|||0
__explicit_bzero_chk|v|dest:*v,len:z,destlen:z||0
__fdelt_chk|l|d:l||0
__fgets_chk|*c|s:*c,size:z,n:i,stream:*@FILE;||0
__fprintf_chk|i|stream:*@FILE;,flag:i,format:^c|vf2|0
__fread_chk|z|ptr:*v,ptrlen:z,size:z,n:z,stream:*@FILE;||0
__getcwd_chk|*c|buf:*c,size:z,buflen:z||0
__h_errno_location|*i|||0
__isoc23_fscanf|i|stream:*@FILE;,format:^c|vs1|0
__isoc23_scanf|i|format:^c|vs0|0
__isoc23_sscanf|i|s:^c,format:^c|vs1|0
__isoc23_strtol|l|nptr:^c,endptr:**c,base:i||0
__isoc23_strtoll|q|nptr:^c,endptr:**c,base:i||0
__isoc23_strtoul|m|nptr:^c,endptr:**c,base:i||0
__isoc23_strtoull|r|nptr:^c,endptr:**c,base:i||0
__isoc99_fscanf|i|stream:*@FILE;,format:^c|vs1|0
__isoc99_scanf|i|format:^c|vs0|0
__isoc99_sscanf|i|s:^c,format:^c|vs1|0
__libc_current_sigrtmax|i|||0
__libc_current_sigrtmin|i|||0
__libc_start_main|i|main:p,argc:i,argv:**c,init:p,fini:p,rtld_fini:p,stack_end:*v||0
__longjmp_chk|v|env:*v,val:i|n|0
__memcpy_chk|*v|dest:*v,src:^v,len:z,destlen:z||0
__memmove_chk|*v|dest:*v,src:^v,len:z,destlen:z||0
__mempcpy_chk|*v|dest:*v,src:^v,len:z,destlen:z||0
__memset_chk|*v|dest:*v,c:i,len:z,destlen:z||0
__pread_chk|y|fd:i,buf:*v,nbytes:z,offset:$off_t;,buflen:z||0
__printf_chk|i|flag:i,format:^c|vf1|0
__read_chk|y|fd:i,buf:*v,nbytes:z,buflen:z||0
__readlink_chk|y|path:^c,buf:*c,len:z,buflen:z||0
__realpath_chk|*c|name:^c,resolved:*c,resolvedlen:z||0
__recv_chk|y|fd:i,buf:*v,n:z,buflen:z,flags:i||0
__register_atfork|i|prepare:p,parent:p,child:p,dso_handle:*v||0
__sigsetjmp|i|env:*v,savemask:i||0
__snprintf_chk|i|s:*c,maxlen:z,flag:i,slen:z,format:^c|vf4|0
__sprintf_chk|i|s:*c,flag:i,slen:z,format:^c|vf3|0
__stack_chk_fail|v||n|0
__stpcpy_chk|*c|dest:*c,src:^c,destlen:z||0
__stpncpy_chk|*c|dest:*c,src:^c,len:z,destlen:z||0
__strcat_chk|*c|dest:*c,src:^c,destlen:z||0
__strcpy_chk|*c|dest:*c,src:^c,destlen:z||0
__strncat_chk|*c|dest:*c,src:^c,len:z,destlen:z||0
__strncpy_chk|*c|dest:*c,src:^c,len:z,destlen:z||0
__syslog_chk|v|priority:i,flag:i,format:^c|vf2|0
__tls_get_addr|*v|ti:*v||0
__vasprintf_chk|i|result:**c,flag:i,format:^c,ap:*@struct __va_list_tag;||0
__vdprintf_chk|i|fd:i,flag:i,format:^c,ap:*@struct __va_list_tag;||0
__vfprintf_chk|i|stream:*@FILE;,flag:i,format:^c,ap:*@struct __va_list_tag;||0
__vprintf_chk|i|flag:i,format:^c,ap:*@struct __va_list_tag;||0
__vsnprintf_chk|i|s:*c,maxlen:z,flag:i,slen:z,format:^c,ap:*@struct __va_list_tag;||0
__vsprintf_chk|i|s:*c,flag:i,slen:z,format:^c,ap:*@struct __va_list_tag;||0
__vsyslog_chk|v|priority:i,flag:i,format:^c,ap:*@struct __va_list_tag;||0
accept4|i|sockfd:i,addr:*v,addrlen:*u,flags:i||0
backtrace|i|buffer:**v,size:i||0
backtrace_symbols|**c|buffer:^*v,size:i||0
backtrace_symbols_fd|v|buffer:^*v,size:i,fd:i||0
canonicalize_file_name|*c|path:^c||0
dl_iterate_phdr|i|callback:p,data:*v||0
dlvsym|*v|handle:*v,name:^c,version:^c||0
dup3|i|oldfd:i,newfd:i,flags:i||0
epoll_create|i|size:i||0
epoll_create1|i|flags:i||0
epoll_ctl|i|epfd:i,op:i,fd:i,event:*v||0
epoll_pwait|i|epfd:i,events:*v,maxevents:i,timeout:i,sigmask:^v||0
epoll_wait|i|epfd:i,events:*v,maxevents:i,timeout:i||0
error|v|status:i,errnum:i,format:^c|vf2|0
error_at_line|v|status:i,errnum:i,filename:^c,linenum:u,format:^c|vf4|0
eventfd|i|initval:u,flags:i||0
fallocate|i|fd:i,mode:i,offset:$off_t;,len:$off_t;||0
get_current_dir_name|*c|||0
getauxval|m|type:m||0
getrandom|y|buf:*v,buflen:z,flags:u||0
gettid|l|||0
gnu_get_libc_version|^c|||0
inotify_add_watch|i|fd:i,pathname:^c,mask:u||0
inotify_init|i|||0
inotify_init1|i|flags:i||0
inotify_rm_watch|i|fd:i,wd:i||0
memfd_create|i|name:^c,flags:u||0
mempcpy|*v|dest:*v,src:^v,n:z||0
memrchr|*v|s:^v,c:i,n:z||0
pipe2|i|pipefd:*i,flags:i||0
posix_fadvise|i|fd:i,offset:$off_t;,len:$off_t;,advice:i||0
ppoll|i|fds:*v,nfds:$nfds_t;,tmo_p:^v,sigmask:^v||0
prctl|i|option:i|v|0
pthread_getattr_np|i|thread:m,attr:*v||0
pthread_getname_np|i|thread:m,name:*c,len:z||0
pthread_setname_np|i|thread:m,name:^c||0
pthread_timedjoin_np|i|thread:m,retval:**v,abstime:^v||0
pthread_tryjoin_np|i|thread:m,retval:**v||0
pthread_yield|i|||0
sched_getaffinity|i|pid:i,cpusetsize:z,mask:*v||0
sched_getcpu|i|||0
sched_setaffinity|i|pid:i,cpusetsize:z,mask:^v||0
secure_getenv|*c|name:^c||0
sendfile|y|out_fd:i,in_fd:i,offset:*$off_t;,count:z||0
signalfd|i|fd:i,mask:^v,flags:i||0
strcasestr|*c|haystack:^c,needle:^c||0
strchrnul|*c|s:^c,c:i||0
syscall|l|number:l|v|0
timerfd_create|i|clockid:i,flags:i||0
timerfd_gettime|i|fd:i,curr_value:*v||0
timerfd_settime|i|fd:i,flags:i,new_value:^v,old_value:*v||0
=daylight|i||0
=environ|**c||0
=optarg|*c||0
=opterr|i||0
=optind|i||0
=optopt|i||0
=program_invocation_name|*c||0
=program_invocation_short_name|*c||0
=stderr|*@FILE;||0
=stdin|*@FILE;||0
=stdout|*@FILE;||0
=timezone|l||0
`;var Pr=Object.freeze({__proto__:null,data:Or,headers:br,provenance:Lr});const kr="macOS SDK 27.0 usr/include",Mr=["_stdlib.h","unistd.h","setjmp.h","sys/socket.h","sys/aio.h","dirent.h","libgen.h","signal.h","sys/termios.h","sys/stat.h","_time.h","sys/syslog.h","sys/fcntl.h","_ctermid.h","dlfcn.h","_stdio.h","sys/unistd.h","grp.h","netdb.h","pwd.h","_strings.h","fnmatch.h","sys/statvfs.h","sys/ipc.h","ftw.h","sys/time.h","sys/resource.h","glob.h","iconv.h","net/if.h","arpa/inet.h","_wctype.h","math.h","_wchar.h","_string.h","sys/mman.h","sys/msg.h","_langinfo.h","sys/poll.h","spawn.h","sys/select.h","pthread.h","sys/uio.h","_regex.h","sys/stdio.h","pthread/sched.h","sys/_select.h","sys/semaphore.h","sys/sem.h","sys/shm.h","termios.h","sys/times.h","sys/utsname.h","utime.h","sys/wait.h","wordexp.h"],xr=`&iconv_t=@struct __tag_iconv_t;
_Exit|v|status:i|n|0
_exit|v|status:i|n|1
_longjmp|v|env:*v,val:i|n|2
_setjmp|i|env:*v||2
a64l|l|a1:^c||0
accept|i|socket:i,address:*@struct sockaddr;,address_len:*u||3
access|i|path:^c,amode:i||1
aio_cancel|i|fd:i,aiocbp:*@struct aiocb;||4
aio_error|i|aiocbp:^@struct aiocb;||4
aio_fsync|i|op:i,aiocbp:*@struct aiocb;||4
aio_read|i|aiocbp:*@struct aiocb;||4
aio_readv|i|aiocbp:*@struct aiocb;||4
aio_return|y|aiocbp:*@struct aiocb;||4
aio_suspend|i|aiocblist:^^@struct aiocb;,nent:i,timeoutp:^@struct timespec;||4
aio_write|i|aiocbp:*@struct aiocb;||4
aio_writev|i|aiocbp:*@struct aiocb;||4
alarm|u|seconds:u||1
alphasort|i|d1:*^@struct dirent;,d2:*^@struct dirent;||5
basename|*c|path:*c||6
bind|i|socket:i,address:^@struct sockaddr;,address_len:u||3
bsd_signal|v|a1:i,a2:p||7
cfgetispeed|$speed_t;|termios_p:^@struct termios;||8
cfgetospeed|$speed_t;|termios_p:^@struct termios;||8
cfsetispeed|i|termios_p:*@struct termios;,speed:$speed_t;||8
cfsetospeed|i|termios_p:*@struct termios;,speed:$speed_t;||8
chdir|i|path:^c||1
chmod|i|path:^c,mode:$mode_t;||9
chown|i|path:^c,owner:u,group:u||1
clock_getres|i|clock_id:u,res:*@struct timespec;||a
clock_gettime|i|clock_id:u,tp:*@struct timespec;||a
clock_settime|i|clock_id:u,tp:^@struct timespec;||a
close|i|fd:i||1
closedir|i|dirp:*@DIR;||5
closelog|v|||b
confstr|z|name:i,buf:*c,len:z||1
connect|i|socket:i,address:^@struct sockaddr;,address_len:u||3
creat|i|path:^c,mode:$mode_t;||c
crypt|*c|a1:^c,a2:^c||1
ctermid|*c|a1:*c||d
dirfd|i|dirp:*@DIR;||5
dirname|*c|path:*c||6
dlclose|i|handle:*v||e
dlerror|*c|||e
dlopen|*v|path:^c,mode:i||e
dlsym|*v|handle:*v,symbol:^c||e
dprintf|i|fd:i,format:^c|vf1|f
drand48|d|||0
dup|i|fd:i||1
dup2|i|fildes:i,fildes2:i||1
dup3|i|oldfd:i,newfd:i,flags:i||g
ecvt|*c|val:d,num_of_digits:i,pt_dec:*i,pt_sign:*i||0
encrypt|v|a1:*c,a2:i||1
endgrent|v|||h
endhostent|v|||i
endnetent|v|||i
endprotoent|v|||i
endpwent|v|||j
endservent|v|||i
erand48|d|a1:*t||0
execl|i|path:^c,arg0:^c|v|1
execle|i|path:^c,arg0:^c|v|1
execlp|i|file:^c,arg0:^c|v|1
execv|i|path:^c,argv:^*c||1
execve|i|file:^c,argv:^*c,envp:^*c||1
execvp|i|file:^c,argv:^*c||1
faccessat|i|fd:i,path:^c,amode:i,flag:i||g
fchdir|i|fd:i||1
fchmod|i|fd:i,mode:$mode_t;||9
fchmodat|i|fd:i,path:^c,mode:$mode_t;,flag:i||9
fchown|i|fd:i,owner:u,group:u||1
fchownat|i|fd:i,path:^c,owner:u,group:u,flag:i||g
fcntl|i|fd:i,cmd:i|v|c
fcvt|*c|val:d,num_of_dec:i,pt_dec:*i,pt_sign:*i||0
fdopen|*@FILE;|fd:i,mode:^c||f
fdopendir|*@DIR;|fd:i||5
ffs|i|a1:i||k
fileno|i|stream:*@FILE;||f
flockfile|v|stream:*@FILE;||f
fmemopen|*@FILE;|buf:*v,size:z,mode:^c||f
fnmatch|i|pattern:^c,string:^c,flags:i||l
fork|i|||1
fpathconf|l|fd:i,name:i||1
freeaddrinfo|v|ai:*@struct addrinfo;||i
fseeko|i|stream:*@FILE;,offset:$off_t;,whence:i||f
fstat|i|fd:i,buf:*@struct stat;||9
fstatat|i|fd:i,path:^c,buf:*@struct stat;,flag:i||9
fstatvfs|i|fd:i,buf:*@struct statvfs;||m
fsync|i|fd:i||1
ftello|$off_t;|stream:*@FILE;||f
ftok|i|a1:^c,a2:i||n
ftruncate|i|fd:i,length:$off_t;||1
ftrylockfile|i|stream:*@FILE;||f
ftw|i|a1:^c,a2:p,a3:i||o
funlockfile|v|stream:*@FILE;||f
futimens|i|fd:i,times:^@struct timespec;||9
gai_strerror|^c|ecode:i||i
gcvt|*c|val:d,num_of_digits:i,dst_buf:*c||0
getaddrinfo|i|nodename:^c,servname:^c,hints:^@struct addrinfo;,res:**@struct addrinfo;||i
getc_unlocked|i|stream:*@FILE;||f
getchar_unlocked|i|||f
getcwd|*c|buf:*c,size:z||1
getdelim|y|linep:**c,linecapp:*z,delimiter:i,stream:*@FILE;||f
getegid|u|||1
geteuid|u|||1
getgid|u|||1
getgrent|*@struct group;|||h
getgrgid|*@struct group;|gid:u||h
getgrgid_r|i|gid:u,grp:*@struct group;,buffer:*c,bufsize:z,result:**@struct group;||h
getgrnam|*@struct group;|name:^c||h
getgrnam_r|i|name:^c,grp:*@struct group;,buffer:*c,bufsize:z,result:**@struct group;||h
getgroups|i|gidsetsize:i,grouplist:*u||1
gethostbyaddr|*@struct hostent;|addr:^v,len:u,type:i||i
gethostbyname|*@struct hostent;|name:^c||i
gethostent|*@struct hostent;|||i
gethostid|l|||1
gethostname|i|name:*c,namelen:z||1
getitimer|i|a1:i,a2:*@struct itimerval;||p
getline|y|linep:**c,linecapp:*z,stream:*@FILE;||f
getlogin|*c|||1
getlogin_r|i|name:*c,namelen:z||1
getnameinfo|i|sa:^@struct sockaddr;,salen:u,host:*c,hostlen:u,serv:*c,servlen:u,flags:i||i
getnetbyaddr|*@struct netent;|a1:u,a2:i||i
getnetbyname|*@struct netent;|a1:^c||i
getnetent|*@struct netent;|||i
getopt|i|argc:i,argv:^*c,optstring:^c||1
getpeername|i|socket:i,address:*@struct sockaddr;,address_len:*u||3
getpgid|i|pid:i||1
getpgrp|i|||1
getpid|i|||1
getppid|i|||1
getpriority|i|which:i,who:u||q
getprotobyname|*@struct protoent;|name:^c||i
getprotobynumber|*@struct protoent;|proto:i||i
getprotoent|*@struct protoent;|||i
getpwent|*@struct passwd;|||j
getpwnam|*@struct passwd;|name:^c||j
getpwnam_r|i|name:^c,pwd:*@struct passwd;,buffer:*c,bufsize:z,result:**@struct passwd;||j
getpwuid|*@struct passwd;|uid:u||j
getpwuid_r|i|uid:u,pwd:*@struct passwd;,buffer:*c,bufsize:z,result:**@struct passwd;||j
getrlimit|i|resource:i,rlp:*@struct rlimit;||q
getrusage|i|who:i,rusage:*@struct rusage;||q
getservbyname|*@struct servent;|name:^c,proto:^c||i
getservbyport|*@struct servent;|port:i,proto:^c||i
getservent|*@struct servent;|||i
getsid|i|pid:i||1
getsockname|i|socket:i,address:*@struct sockaddr;,address_len:*u||3
getsockopt|i|socket:i,level:i,option_name:i,option_value:*v,option_len:*u||3
getsubopt|i|a1:**c,a2:^*c,a3:**c||0
gettimeofday|i|tp:*@struct timeval;,tzp:*v||p
getuid|u|||1
glob|i|pattern:^c,flags:i,errfunc:p,pglob:*@glob_t;||r
glob_b|i|a1:^c,a2:i,a3:p,a4:*@glob_t;||r
globfree|v|pglob:*@glob_t;||r
grantpt|i|a1:i||0
iconv|z|a1:&iconv_t;,a2:**c,a3:*z,a4:**c,a5:*z||s
iconv_close|i|a1:&iconv_t;||s
iconv_open|&iconv_t;|a1:^c,a2:^c||s
if_freenameindex|v|a1:*@struct if_nameindex;||t
if_indextoname|*c|a1:u,a2:*c||t
if_nameindex|*@struct if_nameindex;|||t
if_nametoindex|u|a1:^c||t
inet_addr|u|in:^c||u
inet_ntop|^c|af:i,src:^v,dst:*c,size:u||u
inet_pton|i|af:i,src:^c,dst:*v||u
initstate|*c|a1:u,a2:*c,size:z||0
isatty|i|fd:i||1
iswascii|i|wc:$wint_t;||v
iswhexnumber|i|wc:$wint_t;||v
iswideogram|i|wc:$wint_t;||v
iswnumber|i|wc:$wint_t;||v
iswphonogram|i|wc:$wint_t;||v
iswrune|i|wc:$wint_t;||v
iswspecial|i|wc:$wint_t;||v
j0|d|a1:d||w
j1|d|a1:d||w
jn|d|a1:i,a2:d||w
jrand48|l|a1:*t||0
kill|i|pid:i,sig:i||7
killpg|i|pgrp:i,sig:i||7
l64a|*c|a1:l||0
lchown|i|path:^c,owner:u,group:u||1
lcong48|v|a1:*t||0
link|i|path1:^c,path2:^c||1
linkat|i|a1:i,a2:^c,a3:i,a4:^c,a5:i||g
lio_listio|i|mode:i,aiocblist:^*@struct aiocb;,nent:i,sigp:*@struct sigevent;||4
listen|i|socket:i,backlog:i||3
lockf|i|a1:i,a2:i,a3:$off_t;||1
lrand48|l|||0
lseek|$off_t;|fildes:i,offset:$off_t;,whence:i||1
lstat|i|path:^c,buf:*@struct stat;||9
mbsnrtowcs|z|a1:*w,a2:*^c,a3:z,len:z,a5:*@__mbstate_t;||x
memccpy|*v|dst:*v,src:^v,c:i,n:z||y
mkdir|i|path:^c,mode:$mode_t;||9
mkdirat|i|a1:i,a2:^c,a3:$mode_t;||9
mkfifo|i|path:^c,mode:$mode_t;||9
mkfifoat|i|a1:i,a2:^c,a3:$mode_t;||9
mknod|i|path:^c,mode:$mode_t;,dev:$dev_t;||9
mknodat|i|a1:i,a2:^c,a3:$mode_t;,a4:$dev_t;||9
mkstemp|i|template:*c||0
mktemp|*c|template_name:*c||0
mlock|i|addr:^v,len:z||z
mlockall|i|a1:i||z
mmap|*v|addr:*v,len:z,prot:i,flags:i,fd:i,offset:$off_t;||z
mprotect|i|addr:*v,len:z,prot:i||z
mrand48|l|||0
msgctl|i|a1:i,a2:i,a3:*@struct msqid_ds;||10
msgget|i|a1:i,a2:i||10
msgrcv|y|a1:i,a2:*v,a3:z,a4:l,a5:i||10
msgsnd|i|a1:i,a2:^v,a3:z,a4:i||10
msync|i|addr:*v,len:z,flags:i||z
munlock|i|addr:^v,len:z||z
munlockall|i|||z
munmap|i|addr:*v,len:z||z
nanosleep|i|rqtp:^@struct timespec;,rmtp:*@struct timespec;||a
nftw|i|a1:^c,a2:p,a3:i,a4:i||o
nice|i|incr:i||1
nl_langinfo|*c|a1:i||11
nrand48|l|a1:*t||0
open|i|path:^c,oflag:i|vo1|c
open_memstream|*@FILE;|bufp:**c,sizep:*z||f
open_wmemstream|*@FILE;|bufp:**w,sizep:*z||x
openat|i|fd:i,path:^c,oflag:i|vo2|c
opendir|*@DIR;|filename:^c||5
openlog|v|a1:^c,a2:i,a3:i||b
pathconf|l|path:^c,name:i||1
pause|i|||1
pclose|i|a1:*@FILE;||f
pipe|i|fildes:*i||1
pipe2|i|a1:*i,a2:i||g
poll|i|fds:*@struct pollfd;,nfds:$nfds_t;,timeout:i||12
popen|*@FILE;|a1:^c,a2:^c||f
posix_madvise|i|a1:*v,a2:z,a3:i||z
posix_openpt|i|a1:i||0
posix_spawn|i|a1:*i,a2:^c,a3:^*v,a4:^*v,argv:^*c,envp:^*c||13
posix_spawn_file_actions_addchdir|i|a1:**v,a2:^c||13
posix_spawn_file_actions_addclose|i|a1:**v,a2:i||13
posix_spawn_file_actions_adddup2|i|a1:**v,a2:i,a3:i||13
posix_spawn_file_actions_addfchdir|i|a1:**v,a2:i||13
posix_spawn_file_actions_addopen|i|a1:**v,a2:i,a3:^c,a4:i,a5:$mode_t;||13
posix_spawn_file_actions_destroy|i|a1:**v||13
posix_spawn_file_actions_init|i|a1:**v||13
posix_spawnattr_destroy|i|a1:**v||13
posix_spawnattr_getflags|i|a1:^*v,a2:*s||13
posix_spawnattr_getpgroup|i|a1:^*v,a2:*i||13
posix_spawnattr_getsigdefault|i|a1:^*v,a2:*@sigset_t;||13
posix_spawnattr_getsigmask|i|a1:^*v,a2:*@sigset_t;||13
posix_spawnattr_init|i|a1:**v||13
posix_spawnattr_setflags|i|a1:**v,a2:s||13
posix_spawnattr_setpgroup|i|a1:**v,a2:i||13
posix_spawnattr_setsigdefault|i|a1:**v,a2:^@sigset_t;||13
posix_spawnattr_setsigmask|i|a1:**v,a2:^@sigset_t;||13
posix_spawnp|i|a1:*i,a2:^c,a3:^*v,a4:^*v,argv:^*c,envp:^*c||13
pread|y|fd:i,buf:*v,nbyte:z,offset:$off_t;||1
pselect|i|nfds:i,readfds:*@fd_set;,writefds:*@fd_set;,errorfds:*@fd_set;,timeout:^@struct timespec;,sigmask:^@sigset_t;||14
psignal|v|a1:i,a2:^c||7
pthread_atfork|i|a1:p,a2:p,a3:p||15
pthread_attr_destroy|i|attr:*@__darwin_pthread_attr_t;||15
pthread_attr_getdetachstate|i|a:^@__darwin_pthread_attr_t;,flag:*i||15
pthread_attr_getguardsize|i|a1:^@__darwin_pthread_attr_t;,a2:*z||15
pthread_attr_getinheritsched|i|a:^@__darwin_pthread_attr_t;,flag:*i||15
pthread_attr_getschedparam|i|attr:^@__darwin_pthread_attr_t;,param:*@struct sched_param;||15
pthread_attr_getschedpolicy|i|attr:^@__darwin_pthread_attr_t;,pol:*i||15
pthread_attr_getscope|i|a:^@__darwin_pthread_attr_t;,flag:*i||15
pthread_attr_getstack|i|attr:^@__darwin_pthread_attr_t;,stack:**v,size:*z||15
pthread_attr_getstackaddr|i|attr:^@__darwin_pthread_attr_t;,stack:**v||15
pthread_attr_getstacksize|i|attr:^@__darwin_pthread_attr_t;,size:*z||15
pthread_attr_init|i|attr:*@__darwin_pthread_attr_t;||15
pthread_attr_setdetachstate|i|a:*@__darwin_pthread_attr_t;,flag:i||15
pthread_attr_setguardsize|i|a1:*@__darwin_pthread_attr_t;,a2:z||15
pthread_attr_setinheritsched|i|a:*@__darwin_pthread_attr_t;,flag:i||15
pthread_attr_setschedparam|i|attr:*@__darwin_pthread_attr_t;,param:^@struct sched_param;||15
pthread_attr_setschedpolicy|i|attr:*@__darwin_pthread_attr_t;,pol:i||15
pthread_attr_setscope|i|a:*@__darwin_pthread_attr_t;,flag:i||15
pthread_attr_setstack|i|attr:*@__darwin_pthread_attr_t;,stack:*v,size:z||15
pthread_attr_setstackaddr|i|attr:*@__darwin_pthread_attr_t;,stack:*v||15
pthread_attr_setstacksize|i|attr:*@__darwin_pthread_attr_t;,size:z||15
pthread_cancel|i|thread:m||15
pthread_cond_broadcast|i|cond:*@__darwin_pthread_cond_t;||15
pthread_cond_destroy|i|cond:*@__darwin_pthread_cond_t;||15
pthread_cond_init|i|cond:*@__darwin_pthread_cond_t;,attr:^@__darwin_pthread_condattr_t;||15
pthread_cond_signal|i|cond:*@__darwin_pthread_cond_t;||15
pthread_cond_timedwait|i|cond:*@__darwin_pthread_cond_t;,mutex:*@__darwin_pthread_mutex_t;,abstime:^@struct timespec;||15
pthread_cond_wait|i|cond:*@__darwin_pthread_cond_t;,mutex:*@__darwin_pthread_mutex_t;||15
pthread_condattr_destroy|i|a:*@__darwin_pthread_condattr_t;||15
pthread_condattr_getpshared|i|a:^@__darwin_pthread_condattr_t;,s:*i||15
pthread_condattr_init|i|a:*@__darwin_pthread_condattr_t;||15
pthread_condattr_setpshared|i|a:*@__darwin_pthread_condattr_t;,s:i||15
pthread_create|i|thread:*m,attr:^@__darwin_pthread_attr_t;,start_routine:p,arg:*v||15
pthread_detach|i|thread:m||15
pthread_equal|i|t1:m,t2:m||15
pthread_exit|v|value_ptr:*v|n|15
pthread_getconcurrency|i|||15
pthread_getschedparam|i|thread:m,pol:*i,param:*@struct sched_param;||15
pthread_getspecific|*v|key:$pthread_key_t;||15
pthread_join|i|thread:m,value_ptr:**v||15
pthread_key_create|i|key:*$pthread_key_t;,destructor:p||15
pthread_key_delete|i|key:$pthread_key_t;||15
pthread_kill|i|t:m,sig:i||7
pthread_mutex_destroy|i|mutex:*@__darwin_pthread_mutex_t;||15
pthread_mutex_getprioceiling|i|a1:^@__darwin_pthread_mutex_t;,a2:*i||15
pthread_mutex_init|i|mutex:*@__darwin_pthread_mutex_t;,attr:^@__darwin_pthread_mutexattr_t;||15
pthread_mutex_lock|i|mutex:*@__darwin_pthread_mutex_t;||15
pthread_mutex_setprioceiling|i|a1:*@__darwin_pthread_mutex_t;,a2:i,a3:*i||15
pthread_mutex_trylock|i|mutex:*@__darwin_pthread_mutex_t;||15
pthread_mutex_unlock|i|mutex:*@__darwin_pthread_mutex_t;||15
pthread_mutexattr_destroy|i|a:*@__darwin_pthread_mutexattr_t;||15
pthread_mutexattr_getpolicy_np|i|a1:^@__darwin_pthread_mutexattr_t;,a2:*i||15
pthread_mutexattr_getprioceiling|i|a:^@__darwin_pthread_mutexattr_t;,prio:*i||15
pthread_mutexattr_getprotocol|i|a:^@__darwin_pthread_mutexattr_t;,type:*i||15
pthread_mutexattr_getpshared|i|a:^@__darwin_pthread_mutexattr_t;,type:*i||15
pthread_mutexattr_gettype|i|a:^@__darwin_pthread_mutexattr_t;,type:*i||15
pthread_mutexattr_init|i|a:*@__darwin_pthread_mutexattr_t;||15
pthread_mutexattr_setpolicy_np|i|a1:*@__darwin_pthread_mutexattr_t;,a2:i||15
pthread_mutexattr_setprioceiling|i|a:*@__darwin_pthread_mutexattr_t;,prio:i||15
pthread_mutexattr_setprotocol|i|a:*@__darwin_pthread_mutexattr_t;,type:i||15
pthread_mutexattr_setpshared|i|a:*@__darwin_pthread_mutexattr_t;,type:i||15
pthread_mutexattr_settype|i|a:*@__darwin_pthread_mutexattr_t;,type:i||15
pthread_once|i|once_control:*@__darwin_pthread_once_t;,init_routine:p||15
pthread_rwlock_destroy|i|rwlock:*@__darwin_pthread_rwlock_t;||15
pthread_rwlock_init|i|rwlock:*@__darwin_pthread_rwlock_t;,attr:^@__darwin_pthread_rwlockattr_t;||15
pthread_rwlock_rdlock|i|rwlock:*@__darwin_pthread_rwlock_t;||15
pthread_rwlock_tryrdlock|i|rwlock:*@__darwin_pthread_rwlock_t;||15
pthread_rwlock_trywrlock|i|rwlock:*@__darwin_pthread_rwlock_t;||15
pthread_rwlock_unlock|i|rwlock:*@__darwin_pthread_rwlock_t;||15
pthread_rwlock_wrlock|i|rwlock:*@__darwin_pthread_rwlock_t;||15
pthread_rwlockattr_destroy|i|a:*@__darwin_pthread_rwlockattr_t;||15
pthread_rwlockattr_getpshared|i|a:^@__darwin_pthread_rwlockattr_t;,s:*i||15
pthread_rwlockattr_init|i|a:*@__darwin_pthread_rwlockattr_t;||15
pthread_rwlockattr_setpshared|i|a:*@__darwin_pthread_rwlockattr_t;,s:i||15
pthread_self|m|||15
pthread_setcancelstate|i|state:i,oldstate:*i||15
pthread_setcanceltype|i|type:i,oldtype:*i||15
pthread_setconcurrency|i|new_level:i||15
pthread_setschedparam|i|thread:m,pol:i,param:^@struct sched_param;||15
pthread_setspecific|i|key:$pthread_key_t;,value:^v||15
pthread_sigmask|i|how:i,set:^@sigset_t;,oset:*@sigset_t;||7
pthread_testcancel|v|||15
ptsname|*c|a1:i||0
putc_unlocked|i|a1:i,a2:*@FILE;||f
putchar_unlocked|i|c:i||f
putenv|i|string:*c||0
pwrite|y|fd:i,buf:^v,nbyte:z,offset:$off_t;||1
rand_r|i|seed:*u||0
random|l|||0
read|y|fd:i,buf:*v,nbyte:z||1
readdir|*@struct dirent;|dirp:*@DIR;||5
readdir_r|i|a1:*@DIR;,a2:*@struct dirent;,a3:**@struct dirent;||5
readlink|y|path:^c,buf:*c,bufsize:z||1
readlinkat|y|a1:i,a2:^c,a3:*c,a4:z||g
readv|y|fd:i,iov:^@struct iovec;,iovcnt:i||16
realpath|*c|file_name:^c,resolved_name:*c||0
recv|y|socket:i,buffer:*v,length:z,flags:i||3
recvfrom|y|socket:i,buffer:*v,length:z,flags:i,address:*@struct sockaddr;,address_len:*u||3
recvmsg|y|socket:i,message:*@struct msghdr;,flags:i||3
regcomp|i|preg:*@regex_t;,pattern:^c,cflags:i||17
regerror|z|errcode:i,preg:^@regex_t;,errbuf:*c,errbuf_size:z||17
regexec|i|preg:^@regex_t;,string:^c,nmatch:z,pmatch:*@regmatch_t;,eflags:i||17
regfree|v|preg:*@regex_t;||17
renameat|i|a1:i,a2:^c,a3:i,a4:^c||18
rewinddir|v|dirp:*@DIR;||5
rmdir|i|path:^c||1
scalb|d|x:d,y:d||w
scandir|i|dirname:^c,namelist:***@struct dirent;,select:p,compar:p||5
scandir_b|i|a1:^c,a2:***@struct dirent;,a3:p,a4:p||5
sched_get_priority_max|i|pol:i||19
sched_get_priority_min|i|pol:i||19
sched_yield|i|||19
seed48|*t|a1:*t||0
seekdir|v|dirp:*@DIR;,loc:l||5
select|i|nfds:i,readfds:*@fd_set;,writefds:*@fd_set;,errorfds:*@fd_set;,timeout:*@struct timeval;||1a
sem_close|i|sem:*i||1b
sem_destroy|i|sem:*i||1b
sem_getvalue|i|sem:*i,sval:*i||1b
sem_init|i|sem:*i,pshared:i,value:u||1b
sem_open|*i|name:^c,oflag:i|v|1b
sem_post|i|sem:*i||1b
sem_trywait|i|sem:*i||1b
sem_unlink|i|name:^c||1b
sem_wait|i|sem:*i||1b
semctl|i|a1:i,a2:i,a3:i|v|1c
semget|i|a1:i,a2:i,a3:i||1c
semop|i|a1:i,a2:*@struct sembuf;,a3:z||1c
send|y|socket:i,buffer:^v,length:z,flags:i||3
sendmsg|y|socket:i,message:^@struct msghdr;,flags:i||3
sendto|y|socket:i,buffer:^v,length:z,flags:i,dest_addr:^@struct sockaddr;,dest_len:u||3
setegid|i|gid:u||1
setenv|i|name:^c,value:^c,overwrite:i||0
seteuid|i|uid:u||1
setgid|i|gid:u||1
setgrent|v|||h
sethostent|v|a1:i||i
setitimer|i|a1:i,a2:^@struct itimerval;,a3:*@struct itimerval;||p
setkey|v|a1:^c||0
setlogmask|i|a1:i||b
setnetent|v|a1:i||i
setpgid|i|pid:i,pgid:i||1
setpgrp|i|||1
setpriority|i|which:i,who:u,prio:i||q
setprotoent|v|a1:i||i
setpwent|v|||j
setregid|i|a1:u,a2:u||1
setreuid|i|a1:u,a2:u||1
setrlimit|i|resource:i,rlp:^@struct rlimit;||q
setservent|v|a1:i||i
setsid|i|||1
setsockopt|i|socket:i,level:i,option_name:i,option_value:^v,option_len:u||3
setstate|*c|a1:^c||0
setuid|i|uid:u||1
shm_open|i|a1:^c,a2:i|v|z
shm_unlink|i|name:^c||z
shmat|*v|a1:i,a2:^v,a3:i||1d
shmctl|i|a1:i,a2:i,a3:*@struct shmid_ds;||1d
shmdt|i|a1:^v||1d
shmget|i|a1:i,a2:z,a3:i||1d
shutdown|i|socket:i,how:i||3
sigaction|i|sig:i,act:^@struct sigaction;,oact:*@struct sigaction;||7
sigaddset|i|set:*@sigset_t;,signo:i||7
sigaltstack|i|a1:^@stack_t;,a2:*@stack_t;||7
sigdelset|i|set:*@sigset_t;,signo:i||7
sigemptyset|i|set:*@sigset_t;||7
sigfillset|i|set:*@sigset_t;||7
sighold|i|a1:i||7
sigignore|i|a1:i||7
siginterrupt|i|a1:i,a2:i||7
sigismember|i|set:^@sigset_t;,signo:i||7
siglongjmp|v|env:*v,val:i|n|2
sigpause|i|a1:i||7
sigpending|i|set:*@sigset_t;||7
sigprocmask|i|how:i,set:^@sigset_t;,oset:*@sigset_t;||7
sigrelse|i|a1:i||7
sigset|v|a1:i,a2:p||7
sigsetjmp|i|env:*v,savemask:i||2
sigsuspend|i|sigmask:^@sigset_t;||7
sigwait|i|set:^@sigset_t;,sig:*i||7
sleep|u|seconds:u||1
snprintf|i|str:*c,size:z,format:^c|vf2|f
sockatmark|i|a1:i||3
socket|i|domain:i,type:i,protocol:i||3
socketpair|i|domain:i,type:i,protocol:i,sv:*i||3
srand48|v|a1:l||0
srandom|v|seed:u||0
stat|i|path:^c,buf:*@struct stat;||9
statvfs|i|path:^c,buf:*@struct statvfs;||m
stpcpy|*c|dst:*c,src:^c||y
stpncpy|*c|dst:*c,src:^c,n:z||y
strcasecmp|i|s1:^c,s2:^c||k
strdup|*c|s1:^c||y
strerror_r|i|errnum:i,strerrbuf:*c,buflen:z||y
strncasecmp|i|s1:^c,s2:^c,n:z||k
strndup|*c|s1:^c,n:z||y
strnlen|z|s1:^c,n:z||y
strsignal|*c|sig:i||y
strtok_r|*c|str:*c,sep:^c,lasts:**c||y
swab|v|buf1:^v,buf2:*v,nbytes:y||1
symlink|i|path1:^c,path2:^c||1
symlinkat|i|a1:^c,a2:i,a3:^c||g
sync|v|||1
sysconf|l|name:i||1
syslog|v|a1:i,a2:^c|vf1|b
tcdrain|i|fildes:i||8
tcflow|i|a1:i,a2:i||8
tcflush|i|a1:i,a2:i||8
tcgetattr|i|fildes:i,termios_p:*@struct termios;||8
tcgetpgrp|i|a1:i||1
tcgetsid|i|a1:i||1e
tcsendbreak|i|a1:i,a2:i||8
tcsetattr|i|fildes:i,optional_actions:i,termios_p:^@struct termios;||8
tcsetpgrp|i|a1:i,a2:i||1
telldir|l|dirp:*@DIR;||5
tempnam|*c|dir:^c,prefix:^c||f
times|$clock_t;|a1:*@struct tms;||1f
truncate|i|path:^c,length:$off_t;||1
ttyname|*c|fd:i||1
ttyname_r|i|a1:i,a2:*c,len:z||1
tzset|v|||a
ualarm|$useconds_t;|a1:$useconds_t;,a2:$useconds_t;||1
umask|$mode_t;|cmask:$mode_t;||9
uname|i|a1:*@struct utsname;||1g
unlink|i|path:^c||1
unlinkat|i|fd:i,path:^c,flag:i||g
unlockpt|i|a1:i||0
unsetenv|i|name:^c||0
usleep|i|useconds:$useconds_t;||1
utime|i|a1:^c,a2:^@struct utimbuf;||1h
utimensat|i|fd:i,path:^c,times:^@struct timespec;,flag:i||9
utimes|i|a1:^c,a2:^@struct timeval;||p
vdprintf|i|a1:i,a2:^c,a3:x||f
vfork|i|||1
vfscanf|i|stream:*@FILE;,format:^c,local_argv:x||f
vfwscanf|i|stream:*@FILE;,format:^w,local_argv:x||x
vscanf|i|format:^c,local_argv:x||f
vsnprintf|i|str:*c,size:z,format:^c,local_argv:x||f
vsscanf|i|str:^c,format:^c,local_argv:x||f
vswscanf|i|source:^w,format:^w,local_argv:x||x
vwscanf|i|format:^w,local_argv:x||x
wait|i|stat_loc:*i||1i
waitid|i|a1:u,a2:u,a3:*@siginfo_t;,a4:i||1i
waitpid|i|pid:i,stat_loc:*i,options:i||1i
wcpcpy|*w|a1:*w,a2:^w||x
wcpncpy|*w|a1:*w,a2:^w,n:z||x
wcscasecmp|i|a1:^w,a2:^w||x
wcsdup|*w|str:^w||x
wcsncasecmp|i|a1:^w,a2:^w,n:z||x
wcsnlen|z|src:^w,n:z||x
wcsnrtombs|z|a1:*c,a2:*^w,a3:z,len:z,a5:*@__mbstate_t;||x
wcstof|f|nptr:^w,endptr:**w||x
wcstold|e|a1:^w,a2:**w||x
wcstoll|q|nptr:^w,endptr:**w,base:i||x
wcstoull|r|nptr:^w,endptr:**w,base:i||x
wordexp|i|a1:^c,a2:*@wordexp_t;,a3:i||1j
wordfree|v|a1:*@wordexp_t;||1j
write|y|fd:i,buf:^v,nbyte:z||1
writev|y|fd:i,iov:^@struct iovec;,iovcnt:i||16
y0|d|a1:d||w
y1|d|a1:d||w
yn|d|a1:i,a2:d||w
=_libiconv_version|i||s
=h_errno|i||i
=optarg|*c||1
=opterr|i||1
=optind|i||1
=optopt|i||1
=signgam|i||w
`;var Hr=Object.freeze({__proto__:null,data:xr,headers:Mr,provenance:kr});const zr="mingw-w64 unknown include",Wr=["winreg.h","securitybaseapi.h","winbase.h","winsvc.h","processthreadsapi.h","wincrypt.h","timezoneapi.h","namedpipeapi.h"],Ur=`&HANDLE=v
&HKEY=@struct HKEY__;
AbortSystemShutdownA|i|lpMachineName:*c||0
AbortSystemShutdownW|i|lpMachineName:*w||0
AccessCheck|i|pSecurityDescriptor:*v,ClientToken:&HANDLE;,DesiredAccess:m,GenericMapping:*@GENERIC_MAPPING;,PrivilegeSet:*@struct _PRIVILEGE_SET;,PrivilegeSetLength:*m,GrantedAccess:*m,AccessStatus:*i||1
AccessCheckAndAuditAlarmA|i|SubsystemName:^c,HandleId:*v,ObjectTypeName:*c,ObjectName:*c,SecurityDescriptor:*v,DesiredAccess:m,GenericMapping:*@GENERIC_MAPPING;,ObjectCreation:i,GrantedAccess:*m,AccessStatus:*i,pfGenerateOnClose:*i||2
AccessCheckAndAuditAlarmW|i|SubsystemName:^w,HandleId:*v,ObjectTypeName:*w,ObjectName:*w,SecurityDescriptor:*v,DesiredAccess:m,GenericMapping:*@GENERIC_MAPPING;,ObjectCreation:i,GrantedAccess:*m,AccessStatus:*i,pfGenerateOnClose:*i||1
AccessCheckByType|i|pSecurityDescriptor:*v,PrincipalSelfSid:*v,ClientToken:&HANDLE;,DesiredAccess:m,ObjectTypeList:*@struct _OBJECT_TYPE_LIST;,ObjectTypeListLength:m,GenericMapping:*@GENERIC_MAPPING;,PrivilegeSet:*@struct _PRIVILEGE_SET;,PrivilegeSetLength:*m,GrantedAccess:*m,AccessStatus:*i||1
AccessCheckByTypeAndAuditAlarmA|i|SubsystemName:^c,HandleId:*v,ObjectTypeName:^c,ObjectName:^c,SecurityDescriptor:*v,PrincipalSelfSid:*v,DesiredAccess:m,AuditType:u,Flags:m,ObjectTypeList:*@struct _OBJECT_TYPE_LIST;,ObjectTypeListLength:m,GenericMapping:*@GENERIC_MAPPING;,ObjectCreation:i,GrantedAccess:*m,AccessStatus:*i,pfGenerateOnClose:*i||2
AccessCheckByTypeAndAuditAlarmW|i|SubsystemName:^w,HandleId:*v,ObjectTypeName:^w,ObjectName:^w,SecurityDescriptor:*v,PrincipalSelfSid:*v,DesiredAccess:m,AuditType:u,Flags:m,ObjectTypeList:*@struct _OBJECT_TYPE_LIST;,ObjectTypeListLength:m,GenericMapping:*@GENERIC_MAPPING;,ObjectCreation:i,GrantedAccess:*m,AccessStatus:*i,pfGenerateOnClose:*i||1
AccessCheckByTypeResultList|i|pSecurityDescriptor:*v,PrincipalSelfSid:*v,ClientToken:&HANDLE;,DesiredAccess:m,ObjectTypeList:*@struct _OBJECT_TYPE_LIST;,ObjectTypeListLength:m,GenericMapping:*@GENERIC_MAPPING;,PrivilegeSet:*@struct _PRIVILEGE_SET;,PrivilegeSetLength:*m,GrantedAccessList:*m,AccessStatusList:*m||1
AccessCheckByTypeResultListAndAuditAlarmA|i|SubsystemName:^c,HandleId:*v,ObjectTypeName:^c,ObjectName:^c,SecurityDescriptor:*v,PrincipalSelfSid:*v,DesiredAccess:m,AuditType:u,Flags:m,ObjectTypeList:*@struct _OBJECT_TYPE_LIST;,ObjectTypeListLength:m,GenericMapping:*@GENERIC_MAPPING;,ObjectCreation:i,GrantedAccess:*m,AccessStatusList:*m,pfGenerateOnClose:*i||2
AccessCheckByTypeResultListAndAuditAlarmByHandleA|i|SubsystemName:^c,HandleId:*v,ClientToken:&HANDLE;,ObjectTypeName:^c,ObjectName:^c,SecurityDescriptor:*v,PrincipalSelfSid:*v,DesiredAccess:m,AuditType:u,Flags:m,ObjectTypeList:*@struct _OBJECT_TYPE_LIST;,ObjectTypeListLength:m,GenericMapping:*@GENERIC_MAPPING;,ObjectCreation:i,GrantedAccess:*m,AccessStatusList:*m,pfGenerateOnClose:*i||2
AccessCheckByTypeResultListAndAuditAlarmByHandleW|i|SubsystemName:^w,HandleId:*v,ClientToken:&HANDLE;,ObjectTypeName:^w,ObjectName:^w,SecurityDescriptor:*v,PrincipalSelfSid:*v,DesiredAccess:m,AuditType:u,Flags:m,ObjectTypeList:*@struct _OBJECT_TYPE_LIST;,ObjectTypeListLength:m,GenericMapping:*@GENERIC_MAPPING;,ObjectCreation:i,GrantedAccessList:*m,AccessStatusList:*m,pfGenerateOnClose:*i||1
AccessCheckByTypeResultListAndAuditAlarmW|i|SubsystemName:^w,HandleId:*v,ObjectTypeName:^w,ObjectName:^w,SecurityDescriptor:*v,PrincipalSelfSid:*v,DesiredAccess:m,AuditType:u,Flags:m,ObjectTypeList:*@struct _OBJECT_TYPE_LIST;,ObjectTypeListLength:m,GenericMapping:*@GENERIC_MAPPING;,ObjectCreation:i,GrantedAccessList:*m,AccessStatusList:*m,pfGenerateOnClose:*i||1
AddAccessAllowedAce|i|pAcl:*@ACL;,dwAceRevision:m,AccessMask:m,pSid:*v||1
AddAccessAllowedAceEx|i|pAcl:*@ACL;,dwAceRevision:m,AceFlags:m,AccessMask:m,pSid:*v||1
AddAccessAllowedObjectAce|i|pAcl:*@ACL;,dwAceRevision:m,AceFlags:m,AccessMask:m,ObjectTypeGuid:*@GUID;,InheritedObjectTypeGuid:*@GUID;,pSid:*v||1
AddAccessDeniedAce|i|pAcl:*@ACL;,dwAceRevision:m,AccessMask:m,pSid:*v||1
AddAccessDeniedAceEx|i|pAcl:*@ACL;,dwAceRevision:m,AceFlags:m,AccessMask:m,pSid:*v||1
AddAccessDeniedObjectAce|i|pAcl:*@ACL;,dwAceRevision:m,AceFlags:m,AccessMask:m,ObjectTypeGuid:*@GUID;,InheritedObjectTypeGuid:*@GUID;,pSid:*v||1
AddAce|i|pAcl:*@ACL;,dwAceRevision:m,dwStartingAceIndex:m,pAceList:*v,nAceListLength:m||1
AddAuditAccessAce|i|pAcl:*@ACL;,dwAceRevision:m,dwAccessMask:m,pSid:*v,bAuditSuccess:i,bAuditFailure:i||1
AddAuditAccessAceEx|i|pAcl:*@ACL;,dwAceRevision:m,AceFlags:m,dwAccessMask:m,pSid:*v,bAuditSuccess:i,bAuditFailure:i||1
AddAuditAccessObjectAce|i|pAcl:*@ACL;,dwAceRevision:m,AceFlags:m,AccessMask:m,ObjectTypeGuid:*@GUID;,InheritedObjectTypeGuid:*@GUID;,pSid:*v,bAuditSuccess:i,bAuditFailure:i||1
AddConditionalAce|i|pAcl:*@ACL;,dwAceRevision:m,AceFlags:m,AceType:h,AccessMask:m,pSid:*v,ConditionStr:*w,ReturnLength:*m||2
AddMandatoryAce|i|pAcl:*@ACL;,dwAceRevision:m,AceFlags:m,MandatoryPolicy:m,pLabelSid:*v||1
AdjustTokenGroups|i|TokenHandle:&HANDLE;,ResetToDefault:i,NewState:*@struct _TOKEN_GROUPS;,BufferLength:m,PreviousState:*@struct _TOKEN_GROUPS;,ReturnLength:*m||1
AdjustTokenPrivileges|i|TokenHandle:&HANDLE;,DisableAllPrivileges:i,NewState:*@struct _TOKEN_PRIVILEGES;,BufferLength:m,PreviousState:*@struct _TOKEN_PRIVILEGES;,ReturnLength:*m||1
AllocateAndInitializeSid|i|pIdentifierAuthority:*@struct _SID_IDENTIFIER_AUTHORITY;,nSubAuthorityCount:h,nSubAuthority0:m,nSubAuthority1:m,nSubAuthority2:m,nSubAuthority3:m,nSubAuthority4:m,nSubAuthority5:m,nSubAuthority6:m,nSubAuthority7:m,pSid:**v||1
AllocateLocallyUniqueId|i|Luid:*@struct _LUID;||1
AreAllAccessesGranted|i|GrantedAccess:m,DesiredAccess:m||1
AreAnyAccessesGranted|i|GrantedAccess:m,DesiredAccess:m||1
BackupEventLogA|i|hEventLog:&HANDLE;,lpBackupFileName:^c||2
BackupEventLogW|i|hEventLog:&HANDLE;,lpBackupFileName:^w||2
ChangeServiceConfig2A|i|hService:*@struct SC_HANDLE__;,dwInfoLevel:m,lpInfo:*v||3
ChangeServiceConfig2W|i|hService:*@struct SC_HANDLE__;,dwInfoLevel:m,lpInfo:*v||3
ChangeServiceConfigA|i|hService:*@struct SC_HANDLE__;,dwServiceType:m,dwStartType:m,dwErrorControl:m,lpBinaryPathName:^c,lpLoadOrderGroup:^c,lpdwTagId:*m,lpDependencies:^c,lpServiceStartName:^c,lpPassword:^c,lpDisplayName:^c||3
ChangeServiceConfigW|i|hService:*@struct SC_HANDLE__;,dwServiceType:m,dwStartType:m,dwErrorControl:m,lpBinaryPathName:^w,lpLoadOrderGroup:^w,lpdwTagId:*m,lpDependencies:^w,lpServiceStartName:^w,lpPassword:^w,lpDisplayName:^w||3
CheckForHiberboot|m|pHiberboot:*h,bClearFlag:h||0
CheckTokenMembership|i|TokenHandle:&HANDLE;,SidToCheck:*v,IsMember:*i||1
ClearEventLogA|i|hEventLog:&HANDLE;,lpBackupFileName:^c||2
ClearEventLogW|i|hEventLog:&HANDLE;,lpBackupFileName:^w||2
CloseEncryptedFileRaw|v|pvContext:*v||2
CloseEventLog|i|hEventLog:&HANDLE;||2
CloseServiceHandle|i|hSCObject:*@struct SC_HANDLE__;||3
ControlService|i|hService:*@struct SC_HANDLE__;,dwControl:m,lpServiceStatus:*@struct _SERVICE_STATUS;||3
ControlServiceExA|i|hService:*@struct SC_HANDLE__;,dwControl:m,dwInfoLevel:m,pControlParams:*v||3
ControlServiceExW|i|hService:*@struct SC_HANDLE__;,dwControl:m,dwInfoLevel:m,pControlParams:*v||3
ConvertToAutoInheritPrivateObjectSecurity|i|ParentDescriptor:*v,CurrentSecurityDescriptor:*v,NewSecurityDescriptor:**v,ObjectType:*@GUID;,IsDirectoryObject:h,GenericMapping:*@GENERIC_MAPPING;||1
CopySid|i|nDestinationSidLength:m,pDestinationSid:*v,pSourceSid:*v||1
CreatePrivateObjectSecurity|i|ParentDescriptor:*v,CreatorDescriptor:*v,NewDescriptor:**v,IsDirectoryObject:i,Token:&HANDLE;,GenericMapping:*@GENERIC_MAPPING;||1
CreatePrivateObjectSecurityEx|i|ParentDescriptor:*v,CreatorDescriptor:*v,NewDescriptor:**v,ObjectType:*@GUID;,IsContainerObject:i,AutoInheritFlags:m,Token:&HANDLE;,GenericMapping:*@GENERIC_MAPPING;||1
CreatePrivateObjectSecurityWithMultipleInheritance|i|ParentDescriptor:*v,CreatorDescriptor:*v,NewDescriptor:**v,ObjectTypes:**@GUID;,GuidCount:m,IsContainerObject:i,AutoInheritFlags:m,Token:&HANDLE;,GenericMapping:*@GENERIC_MAPPING;||1
CreateProcessAsUserA|i|hToken:&HANDLE;,lpApplicationName:^c,lpCommandLine:*c,lpProcessAttributes:*@struct _SECURITY_ATTRIBUTES;,lpThreadAttributes:*@struct _SECURITY_ATTRIBUTES;,bInheritHandles:i,dwCreationFlags:m,lpEnvironment:*v,lpCurrentDirectory:^c,lpStartupInfo:*@struct _STARTUPINFOA;,lpProcessInformation:*@struct _PROCESS_INFORMATION;||2
CreateProcessAsUserW|i|hToken:&HANDLE;,lpApplicationName:^w,lpCommandLine:*w,lpProcessAttributes:*@struct _SECURITY_ATTRIBUTES;,lpThreadAttributes:*@struct _SECURITY_ATTRIBUTES;,bInheritHandles:i,dwCreationFlags:m,lpEnvironment:*v,lpCurrentDirectory:^w,lpStartupInfo:*@struct _STARTUPINFOW;,lpProcessInformation:*@struct _PROCESS_INFORMATION;||4
CreateProcessWithLogonW|i|lpUsername:^w,lpDomain:^w,lpPassword:^w,dwLogonFlags:m,lpApplicationName:^w,lpCommandLine:*w,dwCreationFlags:m,lpEnvironment:*v,lpCurrentDirectory:^w,lpStartupInfo:*@struct _STARTUPINFOW;,lpProcessInformation:*@struct _PROCESS_INFORMATION;||2
CreateProcessWithTokenW|i|hToken:&HANDLE;,dwLogonFlags:m,lpApplicationName:^w,lpCommandLine:*w,dwCreationFlags:m,lpEnvironment:*v,lpCurrentDirectory:^w,lpStartupInfo:*@struct _STARTUPINFOW;,lpProcessInformation:*@struct _PROCESS_INFORMATION;||2
CreateRestrictedToken|i|ExistingTokenHandle:&HANDLE;,Flags:m,DisableSidCount:m,SidsToDisable:*@struct _SID_AND_ATTRIBUTES;,DeletePrivilegeCount:m,PrivilegesToDelete:*@struct _LUID_AND_ATTRIBUTES;,RestrictedSidCount:m,SidsToRestrict:*@struct _SID_AND_ATTRIBUTES;,NewTokenHandle:*&HANDLE;||1
CreateServiceA|*@struct SC_HANDLE__;|hSCManager:*@struct SC_HANDLE__;,lpServiceName:^c,lpDisplayName:^c,dwDesiredAccess:m,dwServiceType:m,dwStartType:m,dwErrorControl:m,lpBinaryPathName:^c,lpLoadOrderGroup:^c,lpdwTagId:*m,lpDependencies:^c,lpServiceStartName:^c,lpPassword:^c||3
CreateServiceW|*@struct SC_HANDLE__;|hSCManager:*@struct SC_HANDLE__;,lpServiceName:^w,lpDisplayName:^w,dwDesiredAccess:m,dwServiceType:m,dwStartType:m,dwErrorControl:m,lpBinaryPathName:^w,lpLoadOrderGroup:^w,lpdwTagId:*m,lpDependencies:^w,lpServiceStartName:^w,lpPassword:^w||3
CryptAcquireContextA|i|phProv:*r,szContainer:^c,szProvider:^c,dwProvType:m,dwFlags:m||5
CryptAcquireContextW|i|phProv:*r,szContainer:^w,szProvider:^w,dwProvType:m,dwFlags:m||5
CryptContextAddRef|i|hProv:r,pdwReserved:*m,dwFlags:m||5
CryptCreateHash|i|hProv:r,Algid:u,hKey:r,dwFlags:m,phHash:*r||5
CryptDecrypt|i|hKey:r,hHash:r,Final:i,dwFlags:m,pbData:*h,pdwDataLen:*m||5
CryptDeriveKey|i|hProv:r,Algid:u,hBaseData:r,dwFlags:m,phKey:*r||5
CryptDestroyHash|i|hHash:r||5
CryptDestroyKey|i|hKey:r||5
CryptDuplicateHash|i|hHash:r,pdwReserved:*m,dwFlags:m,phHash:*r||5
CryptDuplicateKey|i|hKey:r,pdwReserved:*m,dwFlags:m,phKey:*r||5
CryptEncrypt|i|hKey:r,hHash:r,Final:i,dwFlags:m,pbData:*h,pdwDataLen:*m,dwBufLen:m||5
CryptEnumProviderTypesA|i|dwIndex:m,pdwReserved:*m,dwFlags:m,pdwProvType:*m,szTypeName:*c,pcbTypeName:*m||5
CryptEnumProviderTypesW|i|dwIndex:m,pdwReserved:*m,dwFlags:m,pdwProvType:*m,szTypeName:*w,pcbTypeName:*m||5
CryptEnumProvidersA|i|dwIndex:m,pdwReserved:*m,dwFlags:m,pdwProvType:*m,szProvName:*c,pcbProvName:*m||5
CryptEnumProvidersW|i|dwIndex:m,pdwReserved:*m,dwFlags:m,pdwProvType:*m,szProvName:*w,pcbProvName:*m||5
CryptExportKey|i|hKey:r,hExpKey:r,dwBlobType:m,dwFlags:m,pbData:*h,pdwDataLen:*m||5
CryptGenKey|i|hProv:r,Algid:u,dwFlags:m,phKey:*r||5
CryptGenRandom|i|hProv:r,dwLen:m,pbBuffer:*h||5
CryptGetDefaultProviderA|i|dwProvType:m,pdwReserved:*m,dwFlags:m,pszProvName:*c,pcbProvName:*m||5
CryptGetDefaultProviderW|i|dwProvType:m,pdwReserved:*m,dwFlags:m,pszProvName:*w,pcbProvName:*m||5
CryptGetHashParam|i|hHash:r,dwParam:m,pbData:*h,pdwDataLen:*m,dwFlags:m||5
CryptGetKeyParam|i|hKey:r,dwParam:m,pbData:*h,pdwDataLen:*m,dwFlags:m||5
CryptGetProvParam|i|hProv:r,dwParam:m,pbData:*h,pdwDataLen:*m,dwFlags:m||5
CryptGetUserKey|i|hProv:r,dwKeySpec:m,phUserKey:*r||5
CryptHashData|i|hHash:r,pbData:^h,dwDataLen:m,dwFlags:m||5
CryptHashSessionKey|i|hHash:r,hKey:r,dwFlags:m||5
CryptImportKey|i|hProv:r,pbData:^h,dwDataLen:m,hPubKey:r,dwFlags:m,phKey:*r||5
CryptReleaseContext|i|hProv:r,dwFlags:m||5
CryptSetHashParam|i|hHash:r,dwParam:m,pbData:^h,dwFlags:m||5
CryptSetKeyParam|i|hKey:r,dwParam:m,pbData:^h,dwFlags:m||5
CryptSetProvParam|i|hProv:r,dwParam:m,pbData:^h,dwFlags:m||5
CryptSetProviderA|i|pszProvName:^c,dwProvType:m||5
CryptSetProviderExA|i|pszProvName:^c,dwProvType:m,pdwReserved:*m,dwFlags:m||5
CryptSetProviderExW|i|pszProvName:^w,dwProvType:m,pdwReserved:*m,dwFlags:m||5
CryptSetProviderW|i|pszProvName:^w,dwProvType:m||5
CryptSignHashA|i|hHash:r,dwKeySpec:m,szDescription:^c,dwFlags:m,pbSignature:*h,pdwSigLen:*m||5
CryptSignHashW|i|hHash:r,dwKeySpec:m,szDescription:^w,dwFlags:m,pbSignature:*h,pdwSigLen:*m||5
CryptVerifySignatureA|i|hHash:r,pbSignature:^h,dwSigLen:m,hPubKey:r,szDescription:^c,dwFlags:m||5
CryptVerifySignatureW|i|hHash:r,pbSignature:^h,dwSigLen:m,hPubKey:r,szDescription:^w,dwFlags:m||5
CveEventWrite|l|CveId:^w,AdditionalDetails:^w||1
DecryptFileA|i|lpFileName:^c,dwReserved:m||2
DecryptFileW|i|lpFileName:^w,dwReserved:m||2
DeleteAce|i|pAcl:*@ACL;,dwAceIndex:m||1
DeleteService|i|hService:*@struct SC_HANDLE__;||3
DeregisterEventSource|i|hEventLog:&HANDLE;||2
DestroyPrivateObjectSecurity|i|ObjectDescriptor:**v||1
DuplicateToken|i|ExistingTokenHandle:&HANDLE;,ImpersonationLevel:u,DuplicateTokenHandle:*&HANDLE;||1
DuplicateTokenEx|i|hExistingToken:&HANDLE;,dwDesiredAccess:m,lpTokenAttributes:*@struct _SECURITY_ATTRIBUTES;,ImpersonationLevel:u,TokenType:u,phNewToken:*&HANDLE;||1
EncryptFileA|i|lpFileName:^c||2
EncryptFileW|i|lpFileName:^w||2
EnumDependentServicesA|i|hService:*@struct SC_HANDLE__;,dwServiceState:m,lpServices:*@struct _ENUM_SERVICE_STATUSA;,cbBufSize:m,pcbBytesNeeded:*m,lpServicesReturned:*m||3
EnumDependentServicesW|i|hService:*@struct SC_HANDLE__;,dwServiceState:m,lpServices:*@struct _ENUM_SERVICE_STATUSW;,cbBufSize:m,pcbBytesNeeded:*m,lpServicesReturned:*m||3
EnumDynamicTimeZoneInformation|m|dwIndex:m,lpTimeZoneInformation:*@struct _TIME_DYNAMIC_ZONE_INFORMATION;||6
EnumServicesStatusA|i|hSCManager:*@struct SC_HANDLE__;,dwServiceType:m,dwServiceState:m,lpServices:*@struct _ENUM_SERVICE_STATUSA;,cbBufSize:m,pcbBytesNeeded:*m,lpServicesReturned:*m,lpResumeHandle:*m||3
EnumServicesStatusExA|i|hSCManager:*@struct SC_HANDLE__;,InfoLevel:u,dwServiceType:m,dwServiceState:m,lpServices:*h,cbBufSize:m,pcbBytesNeeded:*m,lpServicesReturned:*m,lpResumeHandle:*m,pszGroupName:^c||3
EnumServicesStatusExW|i|hSCManager:*@struct SC_HANDLE__;,InfoLevel:u,dwServiceType:m,dwServiceState:m,lpServices:*h,cbBufSize:m,pcbBytesNeeded:*m,lpServicesReturned:*m,lpResumeHandle:*m,pszGroupName:^w||3
EnumServicesStatusW|i|hSCManager:*@struct SC_HANDLE__;,dwServiceType:m,dwServiceState:m,lpServices:*@struct _ENUM_SERVICE_STATUSW;,cbBufSize:m,pcbBytesNeeded:*m,lpServicesReturned:*m,lpResumeHandle:*m||3
EqualDomainSid|i|pSid1:*v,pSid2:*v,pfEqual:*i||1
EqualPrefixSid|i|pSid1:*v,pSid2:*v||1
EqualSid|i|pSid1:*v,pSid2:*v||1
FileEncryptionStatusA|i|lpFileName:^c,lpStatus:*m||2
FileEncryptionStatusW|i|lpFileName:^w,lpStatus:*m||2
FindFirstFreeAce|i|pAcl:*@ACL;,pAce:**v||1
FreeSid|*v|pSid:*v||1
GetAce|i|pAcl:*@ACL;,dwAceIndex:m,pAce:**v||1
GetAclInformation|i|pAcl:*@ACL;,pAclInformation:*v,nAclInformationLength:m,dwAclInformationClass:u||1
GetCurrentHwProfileA|i|lpHwProfileInfo:*@struct tagHW_PROFILE_INFOA;||2
GetCurrentHwProfileW|i|lpHwProfileInfo:*@struct tagHW_PROFILE_INFOW;||2
GetDynamicTimeZoneInformationEffectiveYears|m|lpTimeZoneInformation:*@struct _TIME_DYNAMIC_ZONE_INFORMATION;,FirstYear:*m,LastYear:*m||6
GetEventLogInformation|i|hEventLog:&HANDLE;,dwInfoLevel:m,lpBuffer:*v,cbBufSize:m,pcbBytesNeeded:*m||2
GetFileSecurityA|i|lpFileName:^c,RequestedInformation:m,pSecurityDescriptor:*v,nLength:m,lpnLengthNeeded:*m||2
GetFileSecurityW|i|lpFileName:^w,RequestedInformation:m,pSecurityDescriptor:*v,nLength:m,lpnLengthNeeded:*m||1
GetKernelObjectSecurity|i|Handle:&HANDLE;,RequestedInformation:m,pSecurityDescriptor:*v,nLength:m,lpnLengthNeeded:*m||1
GetLengthSid|m|pSid:*v||1
GetNumberOfEventLogRecords|i|hEventLog:&HANDLE;,NumberOfRecords:*m||2
GetOldestEventLogRecord|i|hEventLog:&HANDLE;,OldestRecord:*m||2
GetPrivateObjectSecurity|i|ObjectDescriptor:*v,SecurityInformation:m,ResultantDescriptor:*v,DescriptorLength:m,ReturnLength:*m||1
GetSecurityDescriptorControl|i|pSecurityDescriptor:*v,pControl:*t,lpdwRevision:*m||1
GetSecurityDescriptorDacl|i|pSecurityDescriptor:*v,lpbDaclPresent:*i,pDacl:**@ACL;,lpbDaclDefaulted:*i||1
GetSecurityDescriptorGroup|i|pSecurityDescriptor:*v,pGroup:**v,lpbGroupDefaulted:*i||1
GetSecurityDescriptorLength|m|pSecurityDescriptor:*v||1
GetSecurityDescriptorOwner|i|pSecurityDescriptor:*v,pOwner:**v,lpbOwnerDefaulted:*i||1
GetSecurityDescriptorRMControl|m|SecurityDescriptor:*v,RMControl:*h||1
GetSecurityDescriptorSacl|i|pSecurityDescriptor:*v,lpbSaclPresent:*i,pSacl:**@ACL;,lpbSaclDefaulted:*i||1
GetServiceDisplayNameA|i|hSCManager:*@struct SC_HANDLE__;,lpServiceName:^c,lpDisplayName:*c,lpcchBuffer:*m||3
GetServiceDisplayNameW|i|hSCManager:*@struct SC_HANDLE__;,lpServiceName:^w,lpDisplayName:*w,lpcchBuffer:*m||3
GetServiceKeyNameA|i|hSCManager:*@struct SC_HANDLE__;,lpDisplayName:^c,lpServiceName:*c,lpcchBuffer:*m||3
GetServiceKeyNameW|i|hSCManager:*@struct SC_HANDLE__;,lpDisplayName:^w,lpServiceName:*w,lpcchBuffer:*m||3
GetSidIdentifierAuthority|*@struct _SID_IDENTIFIER_AUTHORITY;|pSid:*v||1
GetSidLengthRequired|m|nSubAuthorityCount:h||1
GetSidSubAuthority|*m|pSid:*v,nSubAuthority:m||1
GetSidSubAuthorityCount|*h|pSid:*v||1
GetTokenInformation|i|TokenHandle:&HANDLE;,TokenInformationClass:u,TokenInformation:*v,TokenInformationLength:m,ReturnLength:*m||1
GetUserNameA|i|lpBuffer:*c,pcbBuffer:*m||2
GetUserNameW|i|lpBuffer:*w,pcbBuffer:*m||2
GetWindowsAccountDomainSid|i|pSid:*v,pDomainSid:*v,cbDomainSid:*m||1
ImpersonateAnonymousToken|i|ThreadHandle:&HANDLE;||1
ImpersonateLoggedOnUser|i|hToken:&HANDLE;||1
ImpersonateNamedPipeClient|i|hNamedPipe:&HANDLE;||7
ImpersonateSelf|i|ImpersonationLevel:u||1
InitializeAcl|i|pAcl:*@ACL;,nAclLength:m,dwAclRevision:m||1
InitializeSecurityDescriptor|i|pSecurityDescriptor:*v,dwRevision:m||1
InitializeSid|i|Sid:*v,pIdentifierAuthority:*@struct _SID_IDENTIFIER_AUTHORITY;,nSubAuthorityCount:h||1
InitiateShutdownA|m|lpMachineName:*c,lpMessage:*c,dwGracePeriod:m,dwShutdownFlags:m,dwReason:m||0
InitiateShutdownW|m|lpMachineName:*w,lpMessage:*w,dwGracePeriod:m,dwShutdownFlags:m,dwReason:m||0
InitiateSystemShutdownA|i|lpMachineName:*c,lpMessage:*c,dwTimeout:m,bForceAppsClosed:i,bRebootAfterShutdown:i||0
InitiateSystemShutdownExA|i|lpMachineName:*c,lpMessage:*c,dwTimeout:m,bForceAppsClosed:i,bRebootAfterShutdown:i,dwReason:m||0
InitiateSystemShutdownExW|i|lpMachineName:*w,lpMessage:*w,dwTimeout:m,bForceAppsClosed:i,bRebootAfterShutdown:i,dwReason:m||0
InitiateSystemShutdownW|i|lpMachineName:*w,lpMessage:*w,dwTimeout:m,bForceAppsClosed:i,bRebootAfterShutdown:i||0
IsTextUnicode|i|lpv:^v,iSize:i,lpiResult:*i||2
IsTokenRestricted|i|TokenHandle:&HANDLE;||1
IsTokenUntrusted|i|TokenHandle:&HANDLE;||2
IsValidAcl|i|pAcl:*@ACL;||1
IsValidSecurityDescriptor|i|pSecurityDescriptor:*v||1
IsValidSid|i|pSid:*v||1
LockServiceDatabase|*v|hSCManager:*@struct SC_HANDLE__;||3
LogonUserA|i|lpszUsername:^c,lpszDomain:^c,lpszPassword:^c,dwLogonType:m,dwLogonProvider:m,phToken:*&HANDLE;||2
LogonUserExA|i|lpszUsername:^c,lpszDomain:^c,lpszPassword:^c,dwLogonType:m,dwLogonProvider:m,phToken:*&HANDLE;,ppLogonSid:**v,ppProfileBuffer:**v,pdwProfileLength:*m,pQuotaLimits:*@struct _QUOTA_LIMITS;||2
LogonUserExW|i|lpszUsername:^w,lpszDomain:^w,lpszPassword:^w,dwLogonType:m,dwLogonProvider:m,phToken:*&HANDLE;,ppLogonSid:**v,ppProfileBuffer:**v,pdwProfileLength:*m,pQuotaLimits:*@struct _QUOTA_LIMITS;||2
LogonUserW|i|lpszUsername:^w,lpszDomain:^w,lpszPassword:^w,dwLogonType:m,dwLogonProvider:m,phToken:*&HANDLE;||2
LookupPrivilegeDisplayNameA|i|lpSystemName:^c,lpName:^c,lpDisplayName:*c,cchDisplayName:*m,lpLanguageId:*m||2
LookupPrivilegeDisplayNameW|i|lpSystemName:^w,lpName:^w,lpDisplayName:*w,cchDisplayName:*m,lpLanguageId:*m||2
LookupPrivilegeNameA|i|lpSystemName:^c,lpLuid:*@struct _LUID;,lpName:*c,cchName:*m||2
LookupPrivilegeNameW|i|lpSystemName:^w,lpLuid:*@struct _LUID;,lpName:*w,cchName:*m||2
LookupPrivilegeValueA|i|lpSystemName:^c,lpName:^c,lpLuid:*@struct _LUID;||2
LookupPrivilegeValueW|i|lpSystemName:^w,lpName:^w,lpLuid:*@struct _LUID;||2
MakeAbsoluteSD|i|pSelfRelativeSecurityDescriptor:*v,pAbsoluteSecurityDescriptor:*v,lpdwAbsoluteSecurityDescriptorSize:*m,pDacl:*@ACL;,lpdwDaclSize:*m,pSacl:*@ACL;,lpdwSaclSize:*m,pOwner:*v,lpdwOwnerSize:*m,pPrimaryGroup:*v,lpdwPrimaryGroupSize:*m||1
MakeSelfRelativeSD|i|pAbsoluteSecurityDescriptor:*v,pSelfRelativeSecurityDescriptor:*v,lpdwBufferLength:*m||1
MapGenericMask|v|AccessMask:*m,GenericMapping:*@GENERIC_MAPPING;||1
NotifyBootConfigStatus|i|BootAcceptable:i||3
NotifyChangeEventLog|i|hEventLog:&HANDLE;,hEvent:&HANDLE;||2
NotifyServiceStatusChangeA|m|hService:*@struct SC_HANDLE__;,dwNotifyMask:m,pNotifyBuffer:*@struct _SERVICE_NOTIFYA;||3
NotifyServiceStatusChangeW|m|hService:*@struct SC_HANDLE__;,dwNotifyMask:m,pNotifyBuffer:*@struct _SERVICE_NOTIFYW;||3
ObjectCloseAuditAlarmA|i|SubsystemName:^c,HandleId:*v,GenerateOnClose:i||2
ObjectCloseAuditAlarmW|i|SubsystemName:^w,HandleId:*v,GenerateOnClose:i||1
ObjectDeleteAuditAlarmA|i|SubsystemName:^c,HandleId:*v,GenerateOnClose:i||2
ObjectDeleteAuditAlarmW|i|SubsystemName:^w,HandleId:*v,GenerateOnClose:i||1
ObjectOpenAuditAlarmA|i|SubsystemName:^c,HandleId:*v,ObjectTypeName:*c,ObjectName:*c,pSecurityDescriptor:*v,ClientToken:&HANDLE;,DesiredAccess:m,GrantedAccess:m,Privileges:*@struct _PRIVILEGE_SET;,ObjectCreation:i,AccessGranted:i,GenerateOnClose:*i||2
ObjectOpenAuditAlarmW|i|SubsystemName:^w,HandleId:*v,ObjectTypeName:*w,ObjectName:*w,pSecurityDescriptor:*v,ClientToken:&HANDLE;,DesiredAccess:m,GrantedAccess:m,Privileges:*@struct _PRIVILEGE_SET;,ObjectCreation:i,AccessGranted:i,GenerateOnClose:*i||1
ObjectPrivilegeAuditAlarmA|i|SubsystemName:^c,HandleId:*v,ClientToken:&HANDLE;,DesiredAccess:m,Privileges:*@struct _PRIVILEGE_SET;,AccessGranted:i||2
ObjectPrivilegeAuditAlarmW|i|SubsystemName:^w,HandleId:*v,ClientToken:&HANDLE;,DesiredAccess:m,Privileges:*@struct _PRIVILEGE_SET;,AccessGranted:i||1
OpenBackupEventLogA|&HANDLE;|lpUNCServerName:^c,lpFileName:^c||2
OpenBackupEventLogW|&HANDLE;|lpUNCServerName:^w,lpFileName:^w||2
OpenEncryptedFileRawA|m|lpFileName:^c,ulFlags:m,pvContext:**v||2
OpenEncryptedFileRawW|m|lpFileName:^w,ulFlags:m,pvContext:**v||2
OpenEventLogA|&HANDLE;|lpUNCServerName:^c,lpSourceName:^c||2
OpenEventLogW|&HANDLE;|lpUNCServerName:^w,lpSourceName:^w||2
OpenProcessToken|i|ProcessHandle:&HANDLE;,DesiredAccess:m,TokenHandle:*&HANDLE;||4
OpenSCManagerA|*@struct SC_HANDLE__;|lpMachineName:^c,lpDatabaseName:^c,dwDesiredAccess:m||3
OpenSCManagerW|*@struct SC_HANDLE__;|lpMachineName:^w,lpDatabaseName:^w,dwDesiredAccess:m||3
OpenServiceA|*@struct SC_HANDLE__;|hSCManager:*@struct SC_HANDLE__;,lpServiceName:^c,dwDesiredAccess:m||3
OpenServiceW|*@struct SC_HANDLE__;|hSCManager:*@struct SC_HANDLE__;,lpServiceName:^w,dwDesiredAccess:m||3
OpenThreadToken|i|ThreadHandle:&HANDLE;,DesiredAccess:m,OpenAsSelf:i,TokenHandle:*&HANDLE;||4
OperationEnd|i|OperationEndParams:*@OPERATION_END_PARAMETERS;||2
OperationStart|i|OperationStartParams:*@OPERATION_START_PARAMETERS;||2
PrivilegeCheck|i|ClientToken:&HANDLE;,RequiredPrivileges:*@struct _PRIVILEGE_SET;,pfResult:*i||1
PrivilegedServiceAuditAlarmA|i|SubsystemName:^c,ServiceName:^c,ClientToken:&HANDLE;,Privileges:*@struct _PRIVILEGE_SET;,AccessGranted:i||2
PrivilegedServiceAuditAlarmW|i|SubsystemName:^w,ServiceName:^w,ClientToken:&HANDLE;,Privileges:*@struct _PRIVILEGE_SET;,AccessGranted:i||1
QuerySecurityAccessMask|v|SecurityInformation:m,DesiredAccess:*m||1
QueryServiceConfig2A|i|hService:*@struct SC_HANDLE__;,dwInfoLevel:m,lpBuffer:*h,cbBufSize:m,pcbBytesNeeded:*m||3
QueryServiceConfig2W|i|hService:*@struct SC_HANDLE__;,dwInfoLevel:m,lpBuffer:*h,cbBufSize:m,pcbBytesNeeded:*m||3
QueryServiceConfigA|i|hService:*@struct SC_HANDLE__;,lpServiceConfig:*@struct _QUERY_SERVICE_CONFIGA;,cbBufSize:m,pcbBytesNeeded:*m||3
QueryServiceConfigW|i|hService:*@struct SC_HANDLE__;,lpServiceConfig:*@struct _QUERY_SERVICE_CONFIGW;,cbBufSize:m,pcbBytesNeeded:*m||3
QueryServiceLockStatusA|i|hSCManager:*@struct SC_HANDLE__;,lpLockStatus:*@struct _QUERY_SERVICE_LOCK_STATUSA;,cbBufSize:m,pcbBytesNeeded:*m||3
QueryServiceLockStatusW|i|hSCManager:*@struct SC_HANDLE__;,lpLockStatus:*@struct _QUERY_SERVICE_LOCK_STATUSW;,cbBufSize:m,pcbBytesNeeded:*m||3
QueryServiceObjectSecurity|i|hService:*@struct SC_HANDLE__;,dwSecurityInformation:m,lpSecurityDescriptor:*v,cbBufSize:m,pcbBytesNeeded:*m||3
QueryServiceStatus|i|hService:*@struct SC_HANDLE__;,lpServiceStatus:*@struct _SERVICE_STATUS;||3
QueryServiceStatusEx|i|hService:*@struct SC_HANDLE__;,InfoLevel:u,lpBuffer:*h,cbBufSize:m,pcbBytesNeeded:*m||3
ReadEncryptedFileRaw|m|pfExportCallback:p,pvCallbackContext:*v,pvContext:*v||2
ReadEventLogA|i|hEventLog:&HANDLE;,dwReadFlags:m,dwRecordOffset:m,lpBuffer:*v,nNumberOfBytesToRead:m,pnBytesRead:*m,pnMinNumberOfBytesNeeded:*m||2
ReadEventLogW|i|hEventLog:&HANDLE;,dwReadFlags:m,dwRecordOffset:m,lpBuffer:*v,nNumberOfBytesToRead:m,pnBytesRead:*m,pnMinNumberOfBytesNeeded:*m||2
RegCloseKey|l|hKey:&HKEY;||0
RegConnectRegistryA|l|lpMachineName:^c,hKey:&HKEY;,phkResult:*&HKEY;||0
RegConnectRegistryExA|l|lpMachineName:^c,hKey:&HKEY;,Flags:m,phkResult:*&HKEY;||0
RegConnectRegistryExW|l|lpMachineName:^w,hKey:&HKEY;,Flags:m,phkResult:*&HKEY;||0
RegConnectRegistryW|l|lpMachineName:^w,hKey:&HKEY;,phkResult:*&HKEY;||0
RegCopyTreeA|l|hKeySrc:&HKEY;,lpSubKey:^c,hKeyDest:&HKEY;||0
RegCopyTreeW|l|hKeySrc:&HKEY;,lpSubKey:^w,hKeyDest:&HKEY;||0
RegCreateKeyA|l|hKey:&HKEY;,lpSubKey:^c,phkResult:*&HKEY;||0
RegCreateKeyExA|l|hKey:&HKEY;,lpSubKey:^c,Reserved:m,lpClass:*c,dwOptions:m,samDesired:m,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,phkResult:*&HKEY;,lpdwDisposition:*m||0
RegCreateKeyExW|l|hKey:&HKEY;,lpSubKey:^w,Reserved:m,lpClass:*w,dwOptions:m,samDesired:m,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,phkResult:*&HKEY;,lpdwDisposition:*m||0
RegCreateKeyTransactedA|l|hKey:&HKEY;,lpSubKey:^c,Reserved:m,lpClass:*c,dwOptions:m,samDesired:m,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,phkResult:*&HKEY;,lpdwDisposition:*m,hTransaction:&HANDLE;,pExtendedParemeter:*v||0
RegCreateKeyTransactedW|l|hKey:&HKEY;,lpSubKey:^w,Reserved:m,lpClass:*w,dwOptions:m,samDesired:m,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,phkResult:*&HKEY;,lpdwDisposition:*m,hTransaction:&HANDLE;,pExtendedParemeter:*v||0
RegCreateKeyW|l|hKey:&HKEY;,lpSubKey:^w,phkResult:*&HKEY;||0
RegDeleteKeyA|l|hKey:&HKEY;,lpSubKey:^c||0
RegDeleteKeyExA|l|hKey:&HKEY;,lpSubKey:^c,samDesired:m,Reserved:m||0
RegDeleteKeyExW|l|hKey:&HKEY;,lpSubKey:^w,samDesired:m,Reserved:m||0
RegDeleteKeyTransactedA|l|hKey:&HKEY;,lpSubKey:^c,samDesired:m,Reserved:m,hTransaction:&HANDLE;,pExtendedParameter:*v||0
RegDeleteKeyTransactedW|l|hKey:&HKEY;,lpSubKey:^w,samDesired:m,Reserved:m,hTransaction:&HANDLE;,pExtendedParameter:*v||0
RegDeleteKeyValueA|l|hKey:&HKEY;,lpSubKey:^c,lpValueName:^c||0
RegDeleteKeyValueW|l|hKey:&HKEY;,lpSubKey:^w,lpValueName:^w||0
RegDeleteKeyW|l|hKey:&HKEY;,lpSubKey:^w||0
RegDeleteTreeA|l|hKey:&HKEY;,lpSubKey:^c||0
RegDeleteTreeW|l|hKey:&HKEY;,lpSubKey:^w||0
RegDeleteValueA|l|hKey:&HKEY;,lpValueName:^c||0
RegDeleteValueW|l|hKey:&HKEY;,lpValueName:^w||0
RegDisablePredefinedCache|l|||0
RegDisablePredefinedCacheEx|l|||0
RegDisableReflectionKey|l|hBase:&HKEY;||0
RegEnableReflectionKey|l|hBase:&HKEY;||0
RegEnumKeyA|l|hKey:&HKEY;,dwIndex:m,lpName:*c,cchName:m||0
RegEnumKeyExA|l|hKey:&HKEY;,dwIndex:m,lpName:*c,lpcchName:*m,lpReserved:*m,lpClass:*c,lpcchClass:*m,lpftLastWriteTime:*@struct _FILETIME;||0
RegEnumKeyExW|l|hKey:&HKEY;,dwIndex:m,lpName:*w,lpcchName:*m,lpReserved:*m,lpClass:*w,lpcchClass:*m,lpftLastWriteTime:*@struct _FILETIME;||0
RegEnumKeyW|l|hKey:&HKEY;,dwIndex:m,lpName:*w,cchName:m||0
RegEnumValueA|l|hKey:&HKEY;,dwIndex:m,lpValueName:*c,lpcchValueName:*m,lpReserved:*m,lpType:*m,lpData:*h,lpcbData:*m||0
RegEnumValueW|l|hKey:&HKEY;,dwIndex:m,lpValueName:*w,lpcchValueName:*m,lpReserved:*m,lpType:*m,lpData:*h,lpcbData:*m||0
RegFlushKey|l|hKey:&HKEY;||0
RegGetKeySecurity|l|hKey:&HKEY;,SecurityInformation:m,pSecurityDescriptor:*v,lpcbSecurityDescriptor:*m||0
RegGetValueA|l|hkey:&HKEY;,lpSubKey:^c,lpValue:^c,dwFlags:m,pdwType:*m,pvData:*v,pcbData:*m||0
RegGetValueW|l|hkey:&HKEY;,lpSubKey:^w,lpValue:^w,dwFlags:m,pdwType:*m,pvData:*v,pcbData:*m||0
RegLoadAppKeyA|l|lpFile:^c,phkResult:*&HKEY;,samDesired:m,dwOptions:m,Reserved:m||0
RegLoadAppKeyW|l|lpFile:^w,phkResult:*&HKEY;,samDesired:m,dwOptions:m,Reserved:m||0
RegLoadKeyA|l|hKey:&HKEY;,lpSubKey:^c,lpFile:^c||0
RegLoadKeyW|l|hKey:&HKEY;,lpSubKey:^w,lpFile:^w||0
RegLoadMUIStringA|l|hKey:&HKEY;,pszValue:^c,pszOutBuf:*c,cbOutBuf:m,pcbData:*m,Flags:m,pszDirectory:^c||0
RegLoadMUIStringW|l|hKey:&HKEY;,pszValue:^w,pszOutBuf:*w,cbOutBuf:m,pcbData:*m,Flags:m,pszDirectory:^w||0
RegNotifyChangeKeyValue|l|hKey:&HKEY;,bWatchSubtree:i,dwNotifyFilter:m,hEvent:&HANDLE;,fAsynchronous:i||0
RegOpenCurrentUser|l|samDesired:m,phkResult:*&HKEY;||0
RegOpenKeyA|l|hKey:&HKEY;,lpSubKey:^c,phkResult:*&HKEY;||0
RegOpenKeyExA|l|hKey:&HKEY;,lpSubKey:^c,ulOptions:m,samDesired:m,phkResult:*&HKEY;||0
RegOpenKeyExW|l|hKey:&HKEY;,lpSubKey:^w,ulOptions:m,samDesired:m,phkResult:*&HKEY;||0
RegOpenKeyTransactedA|l|hKey:&HKEY;,lpSubKey:^c,ulOptions:m,samDesired:m,phkResult:*&HKEY;,hTransaction:&HANDLE;,pExtendedParameter:*v||0
RegOpenKeyTransactedW|l|hKey:&HKEY;,lpSubKey:^w,ulOptions:m,samDesired:m,phkResult:*&HKEY;,hTransaction:&HANDLE;,pExtendedParameter:*v||0
RegOpenKeyW|l|hKey:&HKEY;,lpSubKey:^w,phkResult:*&HKEY;||0
RegOpenUserClassesRoot|l|hToken:&HANDLE;,dwOptions:m,samDesired:m,phkResult:*&HKEY;||0
RegOverridePredefKey|l|hKey:&HKEY;,hNewHKey:&HKEY;||0
RegQueryInfoKeyA|l|hKey:&HKEY;,lpClass:*c,lpcchClass:*m,lpReserved:*m,lpcSubKeys:*m,lpcbMaxSubKeyLen:*m,lpcbMaxClassLen:*m,lpcValues:*m,lpcbMaxValueNameLen:*m,lpcbMaxValueLen:*m,lpcbSecurityDescriptor:*m,lpftLastWriteTime:*@struct _FILETIME;||0
RegQueryInfoKeyW|l|hKey:&HKEY;,lpClass:*w,lpcchClass:*m,lpReserved:*m,lpcSubKeys:*m,lpcbMaxSubKeyLen:*m,lpcbMaxClassLen:*m,lpcValues:*m,lpcbMaxValueNameLen:*m,lpcbMaxValueLen:*m,lpcbSecurityDescriptor:*m,lpftLastWriteTime:*@struct _FILETIME;||0
RegQueryMultipleValuesA|l|hKey:&HKEY;,val_list:*@struct value_entA;,num_vals:m,lpValueBuf:*c,ldwTotsize:*m||0
RegQueryMultipleValuesW|l|hKey:&HKEY;,val_list:*@struct value_entW;,num_vals:m,lpValueBuf:*w,ldwTotsize:*m||0
RegQueryReflectionKey|l|hBase:&HKEY;,bIsReflectionDisabled:*i||0
RegQueryValueA|l|hKey:&HKEY;,lpSubKey:^c,lpData:*c,lpcbData:*l||0
RegQueryValueExA|l|hKey:&HKEY;,lpValueName:^c,lpReserved:*m,lpType:*m,lpData:*h,lpcbData:*m||0
RegQueryValueExW|l|hKey:&HKEY;,lpValueName:^w,lpReserved:*m,lpType:*m,lpData:*h,lpcbData:*m||0
RegQueryValueW|l|hKey:&HKEY;,lpSubKey:^w,lpData:*w,lpcbData:*l||0
RegRenameKey|l|hKey:&HKEY;,lpSubKeyName:^w,lpNewKeyName:^w||0
RegReplaceKeyA|l|hKey:&HKEY;,lpSubKey:^c,lpNewFile:^c,lpOldFile:^c||0
RegReplaceKeyW|l|hKey:&HKEY;,lpSubKey:^w,lpNewFile:^w,lpOldFile:^w||0
RegRestoreKeyA|l|hKey:&HKEY;,lpFile:^c,dwFlags:m||0
RegRestoreKeyW|l|hKey:&HKEY;,lpFile:^w,dwFlags:m||0
RegSaveKeyA|l|hKey:&HKEY;,lpFile:^c,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;||0
RegSaveKeyExA|l|hKey:&HKEY;,lpFile:^c,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,Flags:m||0
RegSaveKeyExW|l|hKey:&HKEY;,lpFile:^w,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,Flags:m||0
RegSaveKeyW|l|hKey:&HKEY;,lpFile:^w,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;||0
RegSetKeySecurity|l|hKey:&HKEY;,SecurityInformation:m,pSecurityDescriptor:*v||0
RegSetKeyValueA|l|hKey:&HKEY;,lpSubKey:^c,lpValueName:^c,dwType:m,lpData:^v,cbData:m||0
RegSetKeyValueW|l|hKey:&HKEY;,lpSubKey:^w,lpValueName:^w,dwType:m,lpData:^v,cbData:m||0
RegSetValueA|l|hKey:&HKEY;,lpSubKey:^c,dwType:m,lpData:^c,cbData:m||0
RegSetValueExA|l|hKey:&HKEY;,lpValueName:^c,Reserved:m,dwType:m,lpData:^h,cbData:m||0
RegSetValueExW|l|hKey:&HKEY;,lpValueName:^w,Reserved:m,dwType:m,lpData:^h,cbData:m||0
RegSetValueW|l|hKey:&HKEY;,lpSubKey:^w,dwType:m,lpData:^w,cbData:m||0
RegUnLoadKeyA|l|hKey:&HKEY;,lpSubKey:^c||0
RegUnLoadKeyW|l|hKey:&HKEY;,lpSubKey:^w||0
RegisterEventSourceA|&HANDLE;|lpUNCServerName:^c,lpSourceName:^c||2
RegisterEventSourceW|&HANDLE;|lpUNCServerName:^w,lpSourceName:^w||2
RegisterServiceCtrlHandlerA|*@struct SERVICE_STATUS_HANDLE__;|lpServiceName:^c,lpHandlerProc:p||3
RegisterServiceCtrlHandlerExA|*@struct SERVICE_STATUS_HANDLE__;|lpServiceName:^c,lpHandlerProc:p,lpContext:*v||3
RegisterServiceCtrlHandlerExW|*@struct SERVICE_STATUS_HANDLE__;|lpServiceName:^w,lpHandlerProc:p,lpContext:*v||3
RegisterServiceCtrlHandlerW|*@struct SERVICE_STATUS_HANDLE__;|lpServiceName:^w,lpHandlerProc:p||3
ReportEventA|i|hEventLog:&HANDLE;,wType:t,wCategory:t,dwEventID:m,lpUserSid:*v,wNumStrings:t,dwDataSize:m,lpStrings:*^c,lpRawData:*v||2
ReportEventW|i|hEventLog:&HANDLE;,wType:t,wCategory:t,dwEventID:m,lpUserSid:*v,wNumStrings:t,dwDataSize:m,lpStrings:*^w,lpRawData:*v||2
RevertToSelf|i|||1
SetAclInformation|i|pAcl:*@ACL;,pAclInformation:*v,nAclInformationLength:m,dwAclInformationClass:u||1
SetFileSecurityA|i|lpFileName:^c,SecurityInformation:m,pSecurityDescriptor:*v||2
SetFileSecurityW|i|lpFileName:^w,SecurityInformation:m,pSecurityDescriptor:*v||1
SetKernelObjectSecurity|i|Handle:&HANDLE;,SecurityInformation:m,SecurityDescriptor:*v||1
SetPrivateObjectSecurity|i|SecurityInformation:m,ModificationDescriptor:*v,ObjectsSecurityDescriptor:**v,GenericMapping:*@GENERIC_MAPPING;,Token:&HANDLE;||1
SetPrivateObjectSecurityEx|i|SecurityInformation:m,ModificationDescriptor:*v,ObjectsSecurityDescriptor:**v,AutoInheritFlags:m,GenericMapping:*@GENERIC_MAPPING;,Token:&HANDLE;||1
SetSecurityAccessMask|v|SecurityInformation:m,DesiredAccess:*m||1
SetSecurityDescriptorControl|i|pSecurityDescriptor:*v,ControlBitsOfInterest:t,ControlBitsToSet:t||1
SetSecurityDescriptorDacl|i|pSecurityDescriptor:*v,bDaclPresent:i,pDacl:*@ACL;,bDaclDefaulted:i||1
SetSecurityDescriptorGroup|i|pSecurityDescriptor:*v,pGroup:*v,bGroupDefaulted:i||1
SetSecurityDescriptorOwner|i|pSecurityDescriptor:*v,pOwner:*v,bOwnerDefaulted:i||1
SetSecurityDescriptorRMControl|m|SecurityDescriptor:*v,RMControl:*h||1
SetSecurityDescriptorSacl|i|pSecurityDescriptor:*v,bSaclPresent:i,pSacl:*@ACL;,bSaclDefaulted:i||1
SetServiceObjectSecurity|i|hService:*@struct SC_HANDLE__;,dwSecurityInformation:m,lpSecurityDescriptor:*v||3
SetServiceStatus|i|hServiceStatus:*@struct SERVICE_STATUS_HANDLE__;,lpServiceStatus:*@struct _SERVICE_STATUS;||3
SetThreadToken|i|Thread:*&HANDLE;,Token:&HANDLE;||4
SetTokenInformation|i|TokenHandle:&HANDLE;,TokenInformationClass:u,TokenInformation:*v,TokenInformationLength:m||1
StartServiceA|i|hService:*@struct SC_HANDLE__;,dwNumServiceArgs:m,lpServiceArgVectors:*^c||3
StartServiceCtrlDispatcherA|i|lpServiceStartTable:^@SERVICE_TABLE_ENTRYA;||3
StartServiceCtrlDispatcherW|i|lpServiceStartTable:^@SERVICE_TABLE_ENTRYW;||3
StartServiceW|i|hService:*@struct SC_HANDLE__;,dwNumServiceArgs:m,lpServiceArgVectors:*^w||3
UnlockServiceDatabase|i|ScLock:*v||3
Wow64Win32ApiEntry|l|dwFuncNumber:m,dwFlag:m,dwRes:m||0
WriteEncryptedFileRaw|m|pfImportCallback:p,pvCallbackContext:*v,pvContext:*v||2
`;var Br=Object.freeze({__proto__:null,data:Ur,headers:Wr,provenance:zr});const Gr="mingw-w64 unknown include",Vr=["stdlib.h","locale.h","ctype.h","stdio.h","conio.h","corecrt_wconio.h","time.h","corecrt_wctype.h","corecrt_stdio_config.h","corecrt_startup.h","signal.h","math.h","sec_api/stdio_s.h","wchar.h","string.h","sec_api/string_s.h","io.h","malloc.h","process.h","sec_api/conio_s.h","sec_api/wconio_s.h","direct.h","sec_api/stdlib_s.h","errno.h","sys/stat.h","sys/timeb.h","sec_api/sys/timeb_s.h","corecrt_wstdlib.h","corecrt.h","mbstring.h","search.h","sec_api/search_s.h","sec_api/mbstring_s.h","setjmp.h","unistd.h","sec_api/wchar_s.h","wctype.h"],Kr=`_Exit|v|status:i|n|0
___lc_codepage_func|u|||1
___mb_cur_max_func|i|||2
__acrt_iob_func|*@FILE;|index:u||3
__conio_common_vcprintf|i|Options:r,Format:^c,Locale:*@struct localeinfo_struct;,ArgList:x||4
__conio_common_vcprintf_p|i|Options:r,Format:^c,Locale:*@struct localeinfo_struct;,ArgList:x||4
__conio_common_vcprintf_s|i|Options:r,Format:^c,Locale:*@struct localeinfo_struct;,ArgList:x||4
__conio_common_vcscanf|i|Options:r,Format:^c,Locale:*@struct localeinfo_struct;,ArgList:x||4
__conio_common_vcwprintf|i|Options:r,Format:^w,Locale:*@struct localeinfo_struct;,ArgList:x||5
__conio_common_vcwprintf_p|i|Options:r,Format:^w,Locale:*@struct localeinfo_struct;,ArgList:x||5
__conio_common_vcwprintf_s|i|Options:r,Format:^w,Locale:*@struct localeinfo_struct;,ArgList:x||5
__conio_common_vcwscanf|i|Options:r,Format:^w,Locale:*@struct localeinfo_struct;,ArgList:x||5
__daylight|*i|||6
__doserrno|*m|||0
__dstbias|*l|||6
__isascii|i|C:i||2
__iscsym|i|C:i||2
__iscsymf|i|C:i||2
__iswcsym|i|C:$wint_t;||7
__iswcsymf|i|C:$wint_t;||7
__local_stdio_printf_options|*r|||8
__local_stdio_scanf_options|*r|||8
__mingw_isleadbyte_cp|i|c:i,cp:u||1
__ms_fwprintf|i|File:*@FILE;,Format:^w|v|3
__p___argc|*i|||0
__p___argv|***c|||0
__p___wargv|***w|||0
__p__acmdln|**c|||9
__p__environ|***c|||0
__p__fmode|*i|||0
__p__osplatform|*u|||0
__p__osver|*u|||0
__p__pgmptr|**c|||0
__p__wcmdln|**w|||9
__p__wenviron|***w|||0
__p__winmajor|*u|||0
__p__winminor|*u|||0
__p__winver|*u|||0
__p__wpgmptr|**w|||0
__pctype_func|^t|||7
__pwctype_func|^$wctype_t;|||7
__pxcptinfoptrs|**v|||a
__setusermatherr|v|a1:p||b
__stdio_common_vfprintf|i|options:r,file:*@FILE;,format:^c,locale:*@struct localeinfo_struct;,valist:x||3
__stdio_common_vfprintf_p|i|Options:r,File:*@FILE;,Format:^c,Locale:*@struct localeinfo_struct;,ArgList:x||c
__stdio_common_vfprintf_s|i|Options:r,File:*@FILE;,Format:^c,Locale:*@struct localeinfo_struct;,ArgList:x||c
__stdio_common_vfscanf|i|options:r,file:*@FILE;,format:^c,locale:*@struct localeinfo_struct;,valist:x||3
__stdio_common_vfwprintf|i|options:r,file:*@FILE;,format:^w,locale:*@struct localeinfo_struct;,valist:x||3
__stdio_common_vfwprintf_p|i|Options:r,File:*@FILE;,Format:^w,Locale:*@struct localeinfo_struct;,ArgList:x||d
__stdio_common_vfwprintf_s|i|Options:r,File:*@FILE;,Format:^w,Locale:*@struct localeinfo_struct;,ArgList:x||c
__stdio_common_vfwscanf|i|options:r,file:*@FILE;,format:^w,locale:*@struct localeinfo_struct;,valist:x||3
__stdio_common_vsnprintf_s|i|Options:r,Str:*c,Len:z,MaxCount:z,Format:^c,Locale:*@struct localeinfo_struct;,ArgList:x||c
__stdio_common_vsnwprintf_s|i|Options:r,Str:*w,Len:z,MaxCount:z,Format:^w,Locale:*@struct localeinfo_struct;,ArgList:x||c
__stdio_common_vsprintf|i|options:r,str:*c,len:z,format:^c,locale:*@struct localeinfo_struct;,valist:x||3
__stdio_common_vsprintf_p|i|Options:r,Str:*c,Len:z,Format:^c,Locale:*@struct localeinfo_struct;,ArgList:x||c
__stdio_common_vsprintf_s|i|Options:r,Str:*c,Len:z,Format:^c,Locale:*@struct localeinfo_struct;,ArgList:x||c
__stdio_common_vsscanf|i|options:r,input:^c,length:z,format:^c,locale:*@struct localeinfo_struct;,valist:x||3
__stdio_common_vswprintf|i|options:r,str:*w,len:z,format:^w,locale:*@struct localeinfo_struct;,valist:x||3
__stdio_common_vswprintf_p|i|Options:r,Str:*w,Len:z,Format:^w,Locale:*@struct localeinfo_struct;,ArgList:x||d
__stdio_common_vswprintf_s|i|Options:r,Str:*w,Len:z,Format:^w,Locale:*@struct localeinfo_struct;,ArgList:x||c
__stdio_common_vswscanf|i|options:r,input:^w,length:z,format:^w,locale:*@struct localeinfo_struct;,valist:x||3
__sys_errlist|**c|||0
__sys_nerr|*i|||0
__timezone|*l|||6
__toascii|i|C:i||2
__tzname|**c|||6
__wcserror|*w|Str:^w||e
__wcserror_s|i|Buffer:*w,SizeInWords:z,ErrMsg:^w||f
_abs64|q|x:q||0
_access|i|Filename:^c,AccessMode:i||g
_access_s|i|Filename:^c,AccessMode:i||g
_aligned_free|v|Memory:*v||h
_aligned_malloc|*v|Size:z,Alignment:z||h
_aligned_msize|z|Memory:*v,Alignment:z,Offset:z||h
_aligned_offset_malloc|*v|Size:z,Alignment:z,Offset:z||h
_aligned_offset_realloc|*v|Memory:*v,Size:z,Alignment:z,Offset:z||h
_aligned_offset_recalloc|*v|Memory:*v,Count:z,Size:z,Alignment:z,Offset:z||h
_aligned_realloc|*v|Memory:*v,Size:z,Alignment:z||h
_aligned_recalloc|*v|Memory:*v,Count:z,Size:z,Alignment:z||h
_atodbl|i|Result:*@_CRT_DOUBLE;,Str:*c||0
_atodbl_l|i|Result:*@_CRT_DOUBLE;,Str:*c,Locale:*@struct localeinfo_struct;||0
_atof_l|d|String:^c,Locale:*@struct localeinfo_struct;||0
_atoflt|i|Result:*@_CRT_FLOAT;,Str:*c||0
_atoflt_l|i|Result:*@_CRT_FLOAT;,Str:*c,Locale:*@struct localeinfo_struct;||0
_atoi64|q|String:^c||0
_atoi64_l|q|String:^c,Locale:*@struct localeinfo_struct;||0
_atoi_l|i|Str:^c,Locale:*@struct localeinfo_struct;||0
_atol_l|l|Str:^c,Locale:*@struct localeinfo_struct;||0
_atoldbl|i|Result:*@_LDOUBLE;,Str:*c||0
_atoldbl_l|i|Result:*@_LDOUBLE;,Str:*c,Locale:*@struct localeinfo_struct;||0
_beginthread|z|StartAddress:p,StackSize:u,ArgList:*v||i
_beginthreadex|z|Security:*v,StackSize:u,StartAddress:p,ArgList:*v,InitFlag:u,ThrdAddr:*u||i
_byteswap_uint64|r|Int64:r||0
_byteswap_ulong|m|Long:m||0
_byteswap_ushort|t|Short:t||0
_c_exit|v|||i
_cexit|v|||i
_cgets|*c|Buffer:*c||4
_cgets_s|i|Buffer:*c,Size:z,SizeRead:*z||j
_cgetws|*w|Buffer:*w||5
_cgetws_s|i|Buffer:*w,SizeInWords:z,SizeRead:*z||k
_chdir|i|Path:^c||l
_chdrive|i|Drive:i||l
_chgsign|d|X:d||b
_chgsignf|f|X:f||b
_chmod|i|Filename:^c,Mode:i||g
_chsize|i|FileHandle:i,Size:l||g
_chsize_s|i|FileHandle:i,Size:q||g
_close|i|FileHandle:i||g
_commit|i|FileHandle:i||g
_configthreadlocale|i|Flag:i||1
_configure_narrow_argv|i|mode:u||9
_configure_wide_argv|i|mode:u||9
_copysign|d|Number:d,Sign:d||b
_copysignf|f|Number:f,Sign:f||b
_cputs|i|Str:^c||4
_cputws|i|String:^w||5
_creat|i|Filename:^c,PermissionMode:i||g
_create_locale|*@struct localeinfo_struct;|Category:i,Locale:^c||1
_crt_at_quick_exit|i|func:p||9
_crt_atexit|i|func:p||9
_ctime32|*c|Time:^l||6
_ctime32_s|i|Buf:*c,SizeInBytes:z,Time:^l||6
_ctime64|*c|Time:^q||6
_ctime64_s|i|Buf:*c,SizeInBytes:z,Time:^q||6
_cwait|y|TermStat:*i,ProcHandle:y,Action:i||i
_difftime32|d|Time1:l,Time2:l||6
_difftime64|d|Time1:q,Time2:q||6
_dup|i|FileHandle:i||g
_dup2|i|FileHandleSrc:i,FileHandleDst:i||g
_dupenv_s|i|PBuffer:**c,PBufferSizeInBytes:*z,VarName:^c||m
_ecvt|*c|Val:d,NumOfDigits:i,PtDec:*i,PtSign:*i||0
_ecvt_s|i|DstBuf:*c,Size:z,Val:d,NumOfDights:i,PtDec:*i,PtSign:*i||m
_endthread|v||n|i
_endthreadex|v|Retval:u|n|i
_eof|i|FileHandle:i||g
_errno|*i|||n
_execl|y|Filename:^c,ArgList:^c|v|i
_execle|y|Filename:^c,ArgList:^c|v|i
_execlp|y|Filename:^c,ArgList:^c|v|i
_execlpe|y|Filename:^c,ArgList:^c|v|i
_execute_onexit_table|i|a1:*@_onexit_table_t;||9
_execv|y|Filename:^c,ArgList:^^c||i
_execve|y|Filename:^c,ArgList:^^c,Env:^^c||i
_execvp|y|Filename:^c,ArgList:^^c||i
_execvpe|y|Filename:^c,ArgList:^^c,Env:^^c||i
_exit|v|Code:i|n|0
_expand|*v|Memory:*v,NewSize:z||h
_fclose_nolock|i|File:*@FILE;||3
_fcloseall|i|||3
_fcvt|*c|Val:d,NumOfDec:i,PtDec:*i,PtSign:*i||0
_fcvt_s|i|DstBuf:*c,Size:z,Val:d,NumOfDec:i,PtDec:*i,PtSign:*i||m
_fdopen|*@FILE;|FileHandle:i,Mode:^c||3
_fflush_nolock|i|File:*@FILE;||3
_fgetc_nolock|i|File:*@FILE;||3
_fgetchar|i|||3
_fgetwc_nolock|$wint_t;|File:*@FILE;||3
_fgetwchar|$wint_t;|||3
_filelength|l|FileHandle:i||g
_filelengthi64|q|FileHandle:i||g
_fileno|i|File:*@FILE;||3
_findclose|i|FindHandle:y||g
_findfirst32|y|Filename:^c,FindData:*@struct _finddata32_t;||g
_findfirst32i64|y|Filename:^c,FindData:*@struct _finddata32i64_t;||g
_findfirst64|y|Filename:^c,FindData:*@struct __finddata64_t;||g
_findfirst64i32|y|Filename:^c,FindData:*@struct _finddata64i32_t;||g
_findnext32|i|FindHandle:y,FindData:*@struct _finddata32_t;||g
_findnext32i64|i|FindHandle:y,FindData:*@struct _finddata32i64_t;||g
_findnext64|i|FindHandle:y,FindData:*@struct __finddata64_t;||g
_findnext64i32|i|FindHandle:y,FindData:*@struct _finddata64i32_t;||g
_finite|i|a1:d||b
_finitef|i|X:f||b
_flushall|i|||3
_fpclass|i|a1:d||b
_fpclassf|i|X:f||b
_fputc_nolock|i|Char:i,File:*@FILE;||3
_fputchar|i|Ch:i||3
_fputwc_nolock|$wint_t;|Ch:w,File:*@FILE;||3
_fputwchar|$wint_t;|Ch:w||3
_fread_nolock|z|DstBuf:*v,ElementSize:z,Count:z,File:*@FILE;||3
_fread_nolock_s|z|DstBuf:*v,DstSize:z,ElementSize:z,Count:z,File:*@FILE;||c
_free_locale|v|Locale:*@struct localeinfo_struct;||1
_fseek_nolock|i|File:*@FILE;,Offset:l,Origin:i||3
_fseeki64|i|File:*@FILE;,Offset:q,Origin:i||3
_fseeki64_nolock|i|File:*@FILE;,Offset:q,Origin:i||3
_fsopen|*@FILE;|Filename:^c,Mode:^c,ShFlag:i||3
_fstat32|i|FileDes:i,Stat:*@struct _stat32;||o
_fstat32i64|i|FileDes:i,Stat:*@struct _stat32i64;||o
_fstat64|i|FileDes:i,Stat:*@struct _stat64;||o
_fstat64i32|i|FileDes:i,Stat:*@struct _stat64i32;||o
_ftell_nolock|l|File:*@FILE;||3
_ftelli64|q|File:*@FILE;||3
_ftelli64_nolock|q|File:*@FILE;||3
_ftime32|v|Time:*@struct __timeb32;||p
_ftime32_s|i|Time:*@struct __timeb32;||q
_ftime64|v|Time:*@struct __timeb64;||p
_ftime64_s|i|Time:*@struct __timeb64;||q
_fullpath|*c|FullPath:*c,Path:^c,SizeInBytes:z||0
_fwrite_nolock|z|DstBuf:^v,Size:z,Count:z,File:*@FILE;||3
_gcvt|*c|Val:d,NumOfDigits:i,DstBuf:*c||0
_gcvt_s|i|DstBuf:*c,Size:z,Val:d,NumOfDigits:i||m
_get_current_locale|*@struct localeinfo_struct;|||1
_get_daylight|i|Daylight:*i||6
_get_doserrno|i|Value:*m||0
_get_dstbias|i|Daylight_savings_bias:*l||6
_get_errno|i|Value:*i||n
_get_fmode|i|PMode:*i||0
_get_heap_handle|y|||h
_get_initial_narrow_environment|**c|||9
_get_initial_wide_environment|**w|||9
_get_invalid_parameter_handler|p|||0
_get_narrow_winmain_command_line|*c|||9
_get_osfhandle|y|FileHandle:i||g
_get_output_format|u|||3
_get_pgmptr|i|Value:**c||0
_get_printf_count_output|i|||3
_get_purecall_handler|p|||0
_get_timezone|i|Timezone:*l||6
_get_tzname|i|ReturnValue:*z,Buffer:*c,SizeInBytes:z,Index:i||6
_get_wide_winmain_command_line|*w|||9
_get_wpgmptr|i|Value:**w||0
_getc_nolock|i|File:*@FILE;||3
_getch|i|||4
_getch_nolock|i|||4
_getche|i|||4
_getche_nolock|i|||4
_getcwd|*c|DstBuf:*c,SizeInBytes:i||l
_getdcwd|*c|Drive:i,DstBuf:*c,SizeInBytes:i||l
_getdiskfree|u|Drive:u,DiskFree:*@struct _diskfree_t;||l
_getdllprocaddr|p|Handle:y,ProcedureName:*c,Ordinal:y||i
_getdrive|i|||l
_getdrives|m|||l
_getmaxstdio|i|||3
_getpid|i|||i
_getsystime|u|Tm:*@struct tm;||6
_getw|i|File:*@FILE;||3
_getwch|$wint_t;|||5
_getwch_nolock|$wint_t;|||5
_getwche|$wint_t;|||5
_getwche_nolock|$wint_t;|||5
_getws|*w|String:*w||3
_getws_s|*w|Str:*w,SizeInWords:z||c
_gmtime32|*@struct tm;|Time:^l||6
_gmtime32_s|i|Tm:*@struct tm;,Time:^l||6
_gmtime64|*@struct tm;|Time:^q||6
_gmtime64_s|i|Tm:*@struct tm;,Time:^q||6
_heapchk|i|||h
_heapmin|i|||h
_heapwalk|i|EntryInfo:*@_HEAPINFO;||h
_hypot|d|X:d,Y:d||b
_i64toa|*c|Val:q,DstBuf:*c,Radix:i||0
_i64toa_s|i|Val:q,DstBuf:*c,Size:z,Radix:i||m
_i64tow|*w|Val:q,DstBuf:*w,Radix:i||0
_i64tow_s|i|Val:q,DstBuf:*w,SizeInWords:z,Radix:i||r
_initialize_narrow_environment|i|||9
_initialize_onexit_table|i|a1:*@_onexit_table_t;||9
_initialize_wide_environment|i|||9
_initterm|v|First:*p,Last:*p||9
_initterm_e|i|First:*p,Last:*p||9
_invalid_parameter_noinfo|v|||s
_invalid_parameter_noinfo_noreturn|v||n|s
_invoke_watson|v|expression:^w,function_name:^w,file_name:^w,line_number:u,reserved:r|n|s
_isalnum_l|i|C:i,Locale:*@struct localeinfo_struct;||2
_isalpha_l|i|C:i,Locale:*@struct localeinfo_struct;||2
_isatty|i|FileHandle:i||g
_isblank_l|i|C:i,Locale:*@struct localeinfo_struct;||2
_iscntrl_l|i|C:i,Locale:*@struct localeinfo_struct;||2
_iscsym_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||2
_iscsymf_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||2
_isctype|i|C:i,Type:i||2
_isctype_l|i|C:i,Type:i,Locale:*@struct localeinfo_struct;||2
_isdigit_l|i|C:i,Locale:*@struct localeinfo_struct;||2
_isgraph_l|i|C:i,Locale:*@struct localeinfo_struct;||2
_isleadbyte_l|i|C:i,Locale:*@struct localeinfo_struct;||7
_islower_l|i|C:i,Locale:*@struct localeinfo_struct;||2
_ismbblead|i|Ch:u||t
_ismbblead_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbbtrail|i|Ch:u||t
_ismbbtrail_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbcalnum|i|Ch:u||t
_ismbcalnum_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbcalpha|i|Ch:u||t
_ismbcalpha_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbcblank|i|Ch:u||t
_ismbcblank_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbcdigit|i|Ch:u||t
_ismbcdigit_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbcgraph|i|Ch:u||t
_ismbcgraph_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbchira|i|Ch:u||t
_ismbchira_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbckata|i|Ch:u||t
_ismbckata_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbcl0|i|Ch:u||t
_ismbcl0_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbcl1|i|Ch:u||t
_ismbcl1_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbcl2|i|Ch:u||t
_ismbcl2_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbclegal|i|Ch:u||t
_ismbclegal_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbclower|i|Ch:u||t
_ismbclower_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbcprint|i|Ch:u||t
_ismbcprint_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbcpunct|i|Ch:u||t
_ismbcpunct_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbcspace|i|Ch:u||t
_ismbcspace_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbcsymbol|i|Ch:u||t
_ismbcsymbol_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbcupper|i|Ch:u||t
_ismbcupper_l|i|Ch:u,Locale:*@struct localeinfo_struct;||t
_ismbslead|i|Str:^h,Pos:^h||t
_ismbslead_l|i|Str:^h,Pos:^h,Locale:*@struct localeinfo_struct;||t
_ismbstrail|i|Str:^h,Pos:^h||t
_ismbstrail_l|i|Str:^h,Pos:^h,Locale:*@struct localeinfo_struct;||t
_isnan|i|a1:d||b
_isnanf|i|X:f||b
_isprint_l|i|C:i,Locale:*@struct localeinfo_struct;||2
_ispunct_l|i|C:i,Locale:*@struct localeinfo_struct;||2
_isspace_l|i|C:i,Locale:*@struct localeinfo_struct;||2
_isupper_l|i|C:i,Locale:*@struct localeinfo_struct;||2
_iswalnum_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_iswalpha_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_iswblank_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_iswcntrl_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_iswcsym_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_iswcsymf_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_iswctype_l|i|C:$wint_t;,Type:$wctype_t;,Locale:*@struct localeinfo_struct;||7
_iswdigit_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_iswgraph_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_iswlower_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_iswprint_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_iswpunct_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_iswspace_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_iswupper_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_iswxdigit_l|i|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_isxdigit_l|i|C:i,Locale:*@struct localeinfo_struct;||2
_itoa|*c|Value:i,Dest:*c,Radix:i||0
_itoa_s|i|Value:i,DstBuf:*c,Size:z,Radix:i||m
_itow|*w|Value:i,Dest:*w,Radix:i||0
_itow_s|i|Val:i,DstBuf:*w,SizeInWords:z,Radix:i||r
_j0|d|X:d||b
_j1|d|X:d||b
_jn|d|X:i,Y:d||b
_kbhit|i|||4
_lfind|*v|Key:^v,Base:^v,NumOfElements:*u,SizeOfElements:u,PtFuncCompare:p||u
_lfind_s|*v|Key:^v,Base:^v,NumOfElements:*u,SizeOfElements:z,PtFuncCompare:p,Context:*v||v
_loaddll|y|Filename:*c||i
_localtime32|*@struct tm;|Time:^l||6
_localtime32_s|i|Tm:*@struct tm;,Time:^l||6
_localtime64|*@struct tm;|Time:^q||6
_localtime64_s|i|Tm:*@struct tm;,Time:^q||6
_lock_file|v|File:*@FILE;||3
_locking|i|FileHandle:i,LockMode:i,NumOfBytes:l||g
_logb|d|a1:d||b
_logbf|f|X:f||b
_lrotl|m|a1:m,a2:i||0
_lrotr|m|a1:m,a2:i||0
_lsearch|*v|Key:^v,Base:*v,NumOfElements:*u,SizeOfElements:u,PtFuncCompare:p||u
_lsearch_s|*v|Key:^v,Base:*v,NumOfElements:*u,SizeOfElements:z,PtFuncCompare:p,Context:*v||v
_lseek|l|FileHandle:i,Offset:l,Origin:i||g
_lseeki64|q|FileHandle:i,Offset:q,Origin:i||g
_ltoa|*c|Value:l,Dest:*c,Radix:i||0
_ltoa_s|i|Val:l,DstBuf:*c,Size:z,Radix:i||m
_ltow|*w|Value:l,Dest:*w,Radix:i||0
_ltow_s|i|Val:l,DstBuf:*w,SizeInWords:z,Radix:i||r
_makepath|v|Path:*c,Drive:^c,Dir:^c,Filename:^c,Ext:^c||0
_makepath_s|i|PathResult:*c,Size:z,Drive:^c,Dir:^c,Filename:^c,Ext:^c||m
_mbbtombc|u|Ch:u||t
_mbbtombc_l|u|Ch:u,Locale:*@struct localeinfo_struct;||t
_mbbtype|i|Ch:h,CType:i||t
_mbbtype_l|i|Ch:h,CType:i,Locale:*@struct localeinfo_struct;||t
_mbccpy|v|Dst:*h,Src:^h||t
_mbccpy_l|v|Dst:*h,Src:^h,Locale:*@struct localeinfo_struct;||t
_mbccpy_s|i|Dst:*h,DstSizeInBytes:z,PCopied:*i,Src:^h||w
_mbccpy_s_l|i|Dst:*h,DstSizeInBytes:z,PCopied:*i,Src:^h,Locale:*@struct localeinfo_struct;||w
_mbcjistojms|u|Ch:u||t
_mbcjistojms_l|u|Ch:u,Locale:*@struct localeinfo_struct;||t
_mbcjmstojis|u|Ch:u||t
_mbcjmstojis_l|u|Ch:u,Locale:*@struct localeinfo_struct;||t
_mbclen|z|Str:^h||t
_mbclen_l|z|Str:^h,Locale:*@struct localeinfo_struct;||t
_mbctohira|u|Ch:u||t
_mbctohira_l|u|Ch:u,Locale:*@struct localeinfo_struct;||t
_mbctokata|u|Ch:u||t
_mbctokata_l|u|Ch:u,Locale:*@struct localeinfo_struct;||t
_mbctolower|u|Ch:u||t
_mbctolower_l|u|Ch:u,Locale:*@struct localeinfo_struct;||t
_mbctombb|u|Ch:u||t
_mbctombb_l|u|Ch:u,Locale:*@struct localeinfo_struct;||t
_mbctoupper|u|Ch:u||t
_mbctoupper_l|u|Ch:u,Locale:*@struct localeinfo_struct;||t
_mblen_l|i|Ch:^c,MaxCount:z,Locale:*@struct localeinfo_struct;||0
_mbsbtype|i|Str:^h,Pos:z||t
_mbsbtype_l|i|Str:^h,Pos:z,Locale:*@struct localeinfo_struct;||t
_mbscat_s|i|Dst:*h,SizeInBytes:z,Src:^h||w
_mbschr|*h|Str:^h,Ch:u||t
_mbschr_l|*h|Str:^h,Ch:u,Locale:*@struct localeinfo_struct;||t
_mbscmp|i|Str1:^h,Str2:^h||t
_mbscmp_l|i|Str1:^h,Str2:^h,Locale:*@struct localeinfo_struct;||t
_mbscoll|i|Str1:^h,Str2:^h||t
_mbscoll_l|i|Str1:^h,Str2:^h,Locale:*@struct localeinfo_struct;||t
_mbscpy_s|i|Dst:*h,SizeInBytes:z,Src:^h||w
_mbscpy_s_l|i|Dst:*h,DstSizeInBytes:z,Src:^h,Locale:*@struct localeinfo_struct;||w
_mbscspn|z|Str:^h,Control:^h||t
_mbscspn_l|z|Str:^h,Control:^h,Locale:*@struct localeinfo_struct;||t
_mbsdec|*h|Start:^h,Pos:^h||t
_mbsdec_l|*h|Start:^h,Pos:^h,Locale:*@struct localeinfo_struct;||t
_mbsdup|*h|Str:^h||t
_mbsicmp|i|Str1:^h,Str2:^h||t
_mbsicmp_l|i|Str1:^h,Str2:^h,Locale:*@struct localeinfo_struct;||t
_mbsicoll|i|Str1:^h,Str2:^h||t
_mbsicoll_l|i|Str1:^h,Str2:^h,Locale:*@struct localeinfo_struct;||t
_mbsinc|*h|Ptr:^h||t
_mbsinc_l|*h|Ptr:^h,Locale:*@struct localeinfo_struct;||t
_mbslen|z|Str:^h||t
_mbslen_l|z|Str:^h,Locale:*@struct localeinfo_struct;||t
_mbslwr|*h|String:*h||t
_mbslwr_l|*h|String:*h,Locale:*@struct localeinfo_struct;||t
_mbslwr_s|i|Str:*h,SizeInBytes:z||w
_mbslwr_s_l|i|Str:*h,SizeInBytes:z,Locale:*@struct localeinfo_struct;||w
_mbsnbcat|*h|Dest:*h,Source:^h,Count:z||t
_mbsnbcat_l|*h|Dest:*h,Source:^h,Count:z,Locale:*@struct localeinfo_struct;||t
_mbsnbcat_s|i|Dst:*h,DstSizeInBytes:z,Src:^h,MaxCount:z||w
_mbsnbcat_s_l|i|Dst:*h,DstSizeInBytes:z,Src:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||w
_mbsnbcmp|i|Str1:^h,Str2:^h,MaxCount:z||t
_mbsnbcmp_l|i|Str1:^h,Str2:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||t
_mbsnbcnt|z|Str:^h,MaxCount:z||t
_mbsnbcnt_l|z|Str:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||t
_mbsnbcoll|i|Str1:^h,Str2:^h,MaxCount:z||t
_mbsnbcoll_l|i|Str1:^h,Str2:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||t
_mbsnbcpy|*h|Dest:*h,Source:^h,Count:z||t
_mbsnbcpy_l|*h|Dest:*h,Source:^h,Count:z,Locale:*@struct localeinfo_struct;||t
_mbsnbcpy_s|i|Dst:*h,DstSizeInBytes:z,Src:^h,MaxCount:z||w
_mbsnbcpy_s_l|i|Dst:*h,DstSizeInBytes:z,Src:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||w
_mbsnbicmp|i|Str1:^h,Str2:^h,MaxCount:z||t
_mbsnbicmp_l|i|Str1:^h,Str2:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||t
_mbsnbicoll|i|Str1:^h,Str2:^h,MaxCount:z||t
_mbsnbicoll_l|i|Str1:^h,Str2:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||t
_mbsnbset|*h|Str:*h,Ch:u,MaxCount:z||t
_mbsnbset_l|*h|Str:*h,Ch:u,MaxCount:z,Locale:*@struct localeinfo_struct;||t
_mbsnbset_s|i|Dst:*h,DstSizeInBytes:z,Ch:u,MaxCount:z||w
_mbsnbset_s_l|i|Dst:*h,DstSizeInBytes:z,Ch:u,MaxCount:z,Locale:*@struct localeinfo_struct;||w
_mbsncat|*h|Dest:*h,Source:^h,Count:z||t
_mbsncat_l|*h|Dest:*h,Source:^h,Count:z,Locale:*@struct localeinfo_struct;||t
_mbsncat_s|i|Dst:*h,DstSizeInBytes:z,Src:^h,MaxCount:z||w
_mbsncat_s_l|i|Dst:*h,DstSizeInBytes:z,Src:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||w
_mbsnccnt|z|Str:^h,MaxCount:z||t
_mbsnccnt_l|z|Str:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||t
_mbsncmp|i|Str1:^h,Str2:^h,MaxCount:z||t
_mbsncmp_l|i|Str1:^h,Str2:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||t
_mbsncoll|i|Str1:^h,Str2:^h,MaxCount:z||t
_mbsncoll_l|i|Str1:^h,Str2:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||t
_mbsncpy|*h|Dest:*h,Source:^h,Count:z||t
_mbsncpy_l|*h|Dest:*h,Source:^h,Count:z,Locale:*@struct localeinfo_struct;||t
_mbsncpy_s|i|Dst:*h,DstSizeInBytes:z,Src:^h,MaxCount:z||w
_mbsncpy_s_l|i|Dst:*h,DstSizeInBytes:z,Src:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||w
_mbsnextc|u|Str:^h||t
_mbsnextc_l|u|Str:^h,Locale:*@struct localeinfo_struct;||t
_mbsnicmp|i|Str1:^h,Str2:^h,MaxCount:z||t
_mbsnicmp_l|i|Str1:^h,Str2:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||t
_mbsnicoll|i|Str1:^h,Str2:^h,MaxCount:z||t
_mbsnicoll_l|i|Str1:^h,Str2:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||t
_mbsninc|*h|Str:^h,Count:z||t
_mbsninc_l|*h|Str:^h,Count:z,Locale:*@struct localeinfo_struct;||t
_mbsnlen|z|Str:^h,MaxCount:z||t
_mbsnlen_l|z|Str:^h,MaxCount:z,Locale:*@struct localeinfo_struct;||t
_mbsnset|*h|Dst:*h,Val:u,MaxCount:z||t
_mbsnset_l|*h|Dst:*h,Val:u,MaxCount:z,Locale:*@struct localeinfo_struct;||t
_mbsnset_s|i|Dst:*h,DstSizeInBytes:z,Val:u,MaxCount:z||w
_mbsnset_s_l|i|Dst:*h,DstSizeInBytes:z,Val:u,MaxCount:z,Locale:*@struct localeinfo_struct;||w
_mbspbrk|*h|Str:^h,Control:^h||t
_mbspbrk_l|*h|Str:^h,Control:^h,Locale:*@struct localeinfo_struct;||t
_mbsrchr|*h|Str:^h,Ch:u||t
_mbsrchr_l|*h|Str:^h,Ch:u,Locale:*@struct localeinfo_struct;||t
_mbsrev|*h|Str:*h||t
_mbsrev_l|*h|Str:*h,Locale:*@struct localeinfo_struct;||t
_mbsset|*h|Str:*h,Val:u||t
_mbsset_l|*h|Str:*h,Val:u,Locale:*@struct localeinfo_struct;||t
_mbsset_s|i|Dst:*h,DstSizeInBytes:z,Val:u||w
_mbsset_s_l|i|Dst:*h,DstSizeInBytes:z,Val:u,Locale:*@struct localeinfo_struct;||w
_mbsspn|z|Str:^h,Control:^h||t
_mbsspn_l|z|Str:^h,Control:^h,Locale:*@struct localeinfo_struct;||t
_mbsspnp|*h|Str1:^h,Str2:^h||t
_mbsspnp_l|*h|Str1:^h,Str2:^h,Locale:*@struct localeinfo_struct;||t
_mbsstr|*h|Str:^h,Substr:^h||t
_mbsstr_l|*h|Str:^h,Substr:^h,Locale:*@struct localeinfo_struct;||t
_mbstok|*h|Str:*h,Delim:^h||t
_mbstok_l|*h|Str:*h,Delim:^h,Locale:*@struct localeinfo_struct;||t
_mbstok_s|*h|Str:*h,Delim:^h,Context:**h||w
_mbstok_s_l|*h|Str:*h,Delim:^h,Context:**h,Locale:*@struct localeinfo_struct;||w
_mbstowcs_l|z|Dest:*w,Source:^c,MaxCount:z,Locale:*@struct localeinfo_struct;||0
_mbstowcs_s_l|i|PtNumOfCharConverted:*z,DstBuf:*w,SizeInWords:z,SrcBuf:^c,MaxCount:z,Locale:*@struct localeinfo_struct;||m
_mbstrlen|z|Str:^c||0
_mbstrlen_l|z|Str:^c,Locale:*@struct localeinfo_struct;||0
_mbstrnlen|z|Str:^c,MaxCount:z||0
_mbstrnlen_l|z|Str:^c,MaxCount:z,Locale:*@struct localeinfo_struct;||0
_mbsupr|*h|String:*h||t
_mbsupr_l|*h|String:*h,Locale:*@struct localeinfo_struct;||t
_mbsupr_s|i|Str:*h,SizeInBytes:z||w
_mbsupr_s_l|i|Str:*h,SizeInBytes:z,Locale:*@struct localeinfo_struct;||w
_mbtowc_l|i|DstCh:*w,SrcCh:^c,SrcSizeInBytes:z,Locale:*@struct localeinfo_struct;||0
_memccpy|*v|Dst:*v,Src:^v,Val:i,MaxCount:z||e
_memicmp|i|Buf1:^v,Buf2:^v,Size:z||e
_memicmp_l|i|Buf1:^v,Buf2:^v,Size:z,Locale:*@struct localeinfo_struct;||e
_mkdir|i|Path:^c||l
_mkgmtime|$time_t;|Tm:*@struct tm;||6
_mkgmtime32|l|Tm:*@struct tm;||6
_mkgmtime64|q|Tm:*@struct tm;||6
_mktemp|*c|TemplateName:*c||g
_mktemp_s|i|TemplateName:*c,Size:z||g
_mktime32|l|Tm:*@struct tm;||6
_mktime64|q|Tm:*@struct tm;||6
_msize|z|Memory:*v||h
_nextafter|d|a1:d,a2:d||b
_nextafterf|f|X:f,Y:f||b
_onexit|p|Func:p||0
_open|i|Filename:^c,OpenFlag:i|v|g
_open_osfhandle|i|OSFileHandle:y,Flags:i||g
_pclose|i|File:*@FILE;||3
_pipe|i|PtHandles:*i,PipeSize:u,TextMode:i||g
_popen|*@FILE;|Command:^c,Mode:^c||3
_putc_nolock|i|Char:i,File:*@FILE;||3
_putch|i|Ch:i||4
_putch_nolock|i|Ch:i||4
_putenv|i|EnvString:^c||0
_putenv_s|i|Name:^c,Value:^c||m
_putw|i|Word:i,File:*@FILE;||3
_putwch|$wint_t;|WCh:w||5
_putwch_nolock|$wint_t;|WCh:w||5
_putws|i|Str:^w||3
_query_app_type|u|||9
_read|i|FileHandle:i,DstBuf:*v,MaxCharCount:u||g
_recalloc|*v|Memory:*v,Count:z,Size:z||h
_register_onexit_function|i|a1:*@_onexit_table_t;,a2:p||9
_register_thread_local_exe_atexit_callback|v|callback:p||i
_resetstkoflw|i|||h
_rmdir|i|Path:^c||l
_rmtmp|i|||3
_rotl|u|Val:u,Shift:i||0
_rotl64|r|Val:r,Shift:i||0
_rotr|u|Val:u,Shift:i||0
_rotr64|r|Value:r,Shift:i||0
_scalb|d|a1:d,a2:l||b
_scprintf|i|Format:^c|vf0|3
_scwprintf|i|Format:^w|v|3
_searchenv|v|Filename:^c,EnvVar:^c,ResultPath:*c||0
_searchenv_s|i|Filename:^c,EnvVar:^c,ResultPath:*c,SizeInBytes:z||m
_set_abort_behavior|u|Flags:u,Mask:u||0
_set_app_type|v|Type:u||9
_set_doserrno|i|Value:m||0
_set_errno|i|Value:i||n
_set_error_mode|i|Mode:i||0
_set_fmode|i|Mode:i||0
_set_invalid_parameter_handler|p|Handler:p||0
_set_output_format|u|Format:u||3
_set_printf_count_output|i|Value:i||3
_set_purecall_handler|p|Handler:p||0
_setjmp|i|Buf:*v,Frame:*v||x
_setjmpex|i|Buf:*@SETJMP_FLOAT128;,Frame:*v||x
_setmaxstdio|i|Max:i||3
_setmode|i|FileHandle:i,Mode:i||g
_setsystime|u|Tm:*@struct tm;,MilliSec:u||6
_snprintf|i|Dest:*c,Count:z,Format:^c|vf2|3
_snscanf|i|Src:^c,MaxCount:z,Format:^c|vs2|3
_snwprintf|i|Dest:*w,Count:z,Format:^w|v|3
_sopen|i|Filename:^c,OpenFlag:i,ShareFlag:i|v|g
_sopen_s|i|FileHandle:*i,Filename:^c,OpenFlag:i,ShareFlag:i,PermissionMode:i||g
_spawnl|y|Mode:i,Filename:^c,ArgList:^c|v|i
_spawnle|y|Mode:i,Filename:^c,ArgList:^c|v|i
_spawnlp|y|Mode:i,Filename:^c,ArgList:^c|v|i
_spawnlpe|y|Mode:i,Filename:^c,ArgList:^c|v|i
_spawnv|y|Mode:i,Filename:^c,ArgList:^^c||i
_spawnve|y|Mode:i,Filename:^c,ArgList:^^c,Env:^^c||i
_spawnvp|y|Mode:i,Filename:^c,ArgList:^^c||i
_spawnvpe|y|Mode:i,Filename:^c,ArgList:^^c,Env:^^c||i
_splitpath|v|FullPath:^c,Drive:*c,Dir:*c,Filename:*c,Ext:*c||0
_splitpath_s|i|FullPath:^c,Drive:*c,DriveSize:z,Dir:*c,DirSize:z,Filename:*c,FilenameSize:z,Ext:*c,ExtSize:z||m
_stat32|i|Name:^c,Stat:*@struct _stat32;||o
_stat32i64|i|Name:^c,Stat:*@struct _stat32i64;||o
_stat64|i|Name:^c,Stat:*@struct _stat64;||o
_stat64i32|i|Name:^c,Stat:*@struct _stat64i32;||o
_strcmpi|i|Str1:^c,Str2:^c||e
_strcoll_l|i|Str1:^c,Str2:^c,Locale:*@struct localeinfo_struct;||e
_strdate|*c|Buffer:*c||6
_strdate_s|i|Buf:*c,SizeInBytes:z||6
_strdup|*c|Src:^c||e
_strerror|*c|ErrMsg:^c||e
_strerror_s|i|Buf:*c,SizeInBytes:z,ErrMsg:^c||f
_strftime_l|z|Buf:*c,Max_size:z,Format:^c,Tm:^@struct tm;,Locale:*@struct localeinfo_struct;||6
_stricmp|i|Str1:^c,Str2:^c||e
_stricmp_l|i|Str1:^c,Str2:^c,Locale:*@struct localeinfo_struct;||e
_stricoll|i|Str1:^c,Str2:^c||e
_stricoll_l|i|Str1:^c,Str2:^c,Locale:*@struct localeinfo_struct;||e
_strlwr|*c|String:*c||e
_strlwr_s|i|Str:*c,Size:z||f
_strlwr_s_l|i|Str:*c,Size:z,Locale:*@struct localeinfo_struct;||f
_strncoll|i|Str1:^c,Str2:^c,MaxCount:z||e
_strncoll_l|i|Str1:^c,Str2:^c,MaxCount:z,Locale:*@struct localeinfo_struct;||e
_strnicmp|i|Str1:^c,Str2:^c,MaxCount:z||e
_strnicmp_l|i|Str1:^c,Str2:^c,MaxCount:z,Locale:*@struct localeinfo_struct;||e
_strnicoll|i|Str1:^c,Str2:^c,MaxCount:z||e
_strnicoll_l|i|Str1:^c,Str2:^c,MaxCount:z,Locale:*@struct localeinfo_struct;||e
_strnset|*c|Str:*c,Val:i,MaxCount:z||e
_strnset_s|i|Str:*c,Size:z,Val:i,MaxCount:z||f
_strrev|*c|Str:*c||e
_strset|*c|Str:*c,Val:i||e
_strset_s|i|Dst:*c,DstSize:z,Value:i||f
_strtime|*c|Buffer:*c||6
_strtime_s|i|Buf:*c,SizeInBytes:z||6
_strtod_l|d|Str:^c,EndPtr:**c,Locale:*@struct localeinfo_struct;||0
_strtof_l|f|Str:^c,EndPtr:**c,Locale:*@struct localeinfo_struct;||0
_strtoi64|q|String:^c,EndPtr:**c,Radix:i||0
_strtoi64_l|q|String:^c,EndPtr:**c,Radix:i,Locale:*@struct localeinfo_struct;||0
_strtol_l|l|Str:^c,EndPtr:**c,Radix:i,Locale:*@struct localeinfo_struct;||0
_strtoui64|r|String:^c,EndPtr:**c,Radix:i||0
_strtoui64_l|r|String:^c,EndPtr:**c,Radix:i,Locale:*@struct localeinfo_struct;||0
_strtoul_l|m|Str:^c,EndPtr:**c,Radix:i,Locale:*@struct localeinfo_struct;||0
_strupr|*c|String:*c||e
_strupr_l|*c|String:*c,Locale:*@struct localeinfo_struct;||e
_strupr_s|i|Str:*c,Size:z||f
_strupr_s_l|i|Str:*c,Size:z,Locale:*@struct localeinfo_struct;||f
_strxfrm_l|z|Dst:*c,Src:^c,MaxCount:z,Locale:*@struct localeinfo_struct;||e
_swab|v|Buf1:*c,Buf2:*c,SizeInBytes:i||0
_swprintf|i|Dest:*w,Format:^w|v|3
_tell|l|FileHandle:i||g
_telli64|q|FileHandle:i||g
_tempnam|*c|DirName:^c,FilePrefix:^c||3
_time32|l|Time:*l||6
_time64|q|Time:*q||6
_timespec32_get|i|Ts:*@struct _timespec32;,Base:i||6
_timespec64_get|i|Ts:*@struct _timespec64;,Base:i||6
_tolower|i|C:i||2
_tolower_l|i|C:i,Locale:*@struct localeinfo_struct;||2
_toupper|i|C:i||2
_toupper_l|i|C:i,Locale:*@struct localeinfo_struct;||2
_towlower_l|$wint_t;|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_towupper_l|$wint_t;|C:$wint_t;,Locale:*@struct localeinfo_struct;||7
_tzset|v|||6
_ui64toa|*c|Val:r,DstBuf:*c,Radix:i||0
_ui64toa_s|i|Val:r,DstBuf:*c,Size:z,Radix:i||m
_ui64tow|*w|Val:r,DstBuf:*w,Radix:i||0
_ui64tow_s|i|Val:r,DstBuf:*w,SizeInWords:z,Radix:i||r
_ultoa|*c|Value:m,Dest:*c,Radix:i||0
_ultoa_s|i|Val:m,DstBuf:*c,Size:z,Radix:i||m
_ultow|*w|Value:m,Dest:*w,Radix:i||0
_ultow_s|i|Val:m,DstBuf:*w,SizeInWords:z,Radix:i||r
_umask|i|Mode:i||g
_umask_s|i|NewMode:i,OldMode:*i||g
_ungetc_nolock|i|Ch:i,File:*@FILE;||3
_ungetch|i|Ch:i||4
_ungetch_nolock|i|Ch:i||4
_ungetwc_nolock|$wint_t;|Ch:$wint_t;,File:*@FILE;||3
_ungetwch|$wint_t;|WCh:$wint_t;||5
_ungetwch_nolock|$wint_t;|WCh:$wint_t;||5
_unlink|i|Filename:^c||g
_unloaddll|i|Handle:y||i
_unlock_file|v|File:*@FILE;||3
_vscprintf|i|Format:^c,ArgList:x||3
_vscwprintf|i|Format:^w,ArgList:x||3
_vsnprintf|i|Dest:*c,Count:z,Format:^c,Args:x||3
_vsnwprintf|i|Dest:*w,Count:z,Format:^w,Args:x||3
_vswprintf|i|Dest:*w,Format:^w,Args:x||3
_waccess|i|Filename:^w,AccessMode:i||g
_waccess_s|i|Filename:^w,AccessMode:i||g
_wasctime|*w|Tm:^@struct tm;||6
_wasctime_s|i|Buf:*w,SizeInWords:z,Tm:^@struct tm;||6
_wchdir|i|Path:^w||l
_wchmod|i|Filename:^w,Mode:i||g
_wcreat|i|Filename:^w,PermissionMode:i||g
_wcreate_locale|*@struct localeinfo_struct;|Category:i,Locale:^w||1
_wcscoll_l|i|Str1:^w,Str2:^w,Locale:*@struct localeinfo_struct;||e
_wcsdup|*w|Str:^w||e
_wcserror|*w|ErrNum:i||e
_wcserror_s|i|Buf:*w,SizeInWords:z,ErrNum:i||f
_wcsftime_l|z|Buf:*w,SizeInWords:z,Format:^w,Tm:^@struct tm;,Locale:*@struct localeinfo_struct;||6
_wcsicmp|i|Str1:^w,Str2:^w||e
_wcsicmp_l|i|Str1:^w,Str2:^w,Locale:*@struct localeinfo_struct;||e
_wcsicoll|i|Str1:^w,Str2:^w||e
_wcsicoll_l|i|Str1:^w,Str2:^w,Locale:*@struct localeinfo_struct;||e
_wcslwr|*w|String:*w||e
_wcslwr_l|*w|String:*w,Locale:*@struct localeinfo_struct;||e
_wcslwr_s|i|Str:*w,SizeInWords:z||f
_wcslwr_s_l|i|Str:*w,SizeInWords:z,Locale:*@struct localeinfo_struct;||f
_wcsncoll|i|Str1:^w,Str2:^w,MaxCount:z||e
_wcsncoll_l|i|Str1:^w,Str2:^w,MaxCount:z,Locale:*@struct localeinfo_struct;||e
_wcsnicmp|i|Str1:^w,Str2:^w,MaxCount:z||e
_wcsnicmp_l|i|Str1:^w,Str2:^w,MaxCount:z,Locale:*@struct localeinfo_struct;||e
_wcsnicoll|i|Str1:^w,Str2:^w,MaxCount:z||e
_wcsnicoll_l|i|Str1:^w,Str2:^w,MaxCount:z,Locale:*@struct localeinfo_struct;||e
_wcsnset|*w|Str:*w,Val:w,MaxCount:z||e
_wcsnset_s|i|Dst:*w,DstSizeInWords:z,Val:w,MaxCount:z||f
_wcsrev|*w|Str:*w||e
_wcsset|*w|Str:*w,Val:w||e
_wcsset_s|i|Str:*w,SizeInWords:z,Val:w||f
_wcstod_l|d|Str:^w,EndPtr:**w,Locale:*@struct localeinfo_struct;||0
_wcstof_l|f|Str:^w,EndPtr:**w,Locale:*@struct localeinfo_struct;||0
_wcstoi64|q|Str:^w,EndPtr:**w,Radix:i||0
_wcstoi64_l|q|Str:^w,EndPtr:**w,Radix:i,Locale:*@struct localeinfo_struct;||0
_wcstok|*w|Str:*w,Delim:^w||e
_wcstol_l|l|Str:^w,EndPtr:**w,Radix:i,Locale:*@struct localeinfo_struct;||0
_wcstombs_l|z|Dest:*c,Source:^w,MaxCount:z,Locale:*@struct localeinfo_struct;||0
_wcstombs_s_l|i|PtNumOfCharConverted:*z,Dst:*c,DstSizeInBytes:z,Src:^w,MaxCountInBytes:z,Locale:*@struct localeinfo_struct;||m
_wcstoui64|r|Str:^w,EndPtr:**w,Radix:i||0
_wcstoui64_l|r|Str:^w,EndPtr:**w,Radix:i,Locale:*@struct localeinfo_struct;||0
_wcstoul_l|m|Str:^w,EndPtr:**w,Radix:i,Locale:*@struct localeinfo_struct;||0
_wcsupr|*w|String:*w||e
_wcsupr_l|*w|String:*w,Locale:*@struct localeinfo_struct;||e
_wcsupr_s|i|Str:*w,Size:z||f
_wcsupr_s_l|i|Str:*w,Size:z,Locale:*@struct localeinfo_struct;||f
_wcsxfrm_l|z|Dst:*w,Src:^w,MaxCount:z,Locale:*@struct localeinfo_struct;||e
_wctime|*w|Time:^$time_t;||6
_wctime32|*w|Time:^l||6
_wctime32_s|i|Buf:*w,SizeInWords:z,Time:^l||6
_wctime64|*w|Time:^q||6
_wctime64_s|i|Buf:*w,SizeInWords:z,Time:^q||6
_wctomb_l|i|MbCh:*c,WCh:w,Locale:*@struct localeinfo_struct;||0
_wctomb_s_l|i|SizeConverted:*i,MbCh:*c,SizeInBytes:z,WCh:w,Locale:*@struct localeinfo_struct;||m
_wdupenv_s|i|Buffer:**w,BufferSizeInWords:*z,VarName:^w||r
_wexecl|y|Filename:^w,ArgList:^w|v|i
_wexecle|y|Filename:^w,ArgList:^w|v|i
_wexeclp|y|Filename:^w,ArgList:^w|v|i
_wexeclpe|y|Filename:^w,ArgList:^w|v|i
_wexecv|y|Filename:^w,ArgList:^^w||i
_wexecve|y|Filename:^w,ArgList:^^w,Env:^^w||i
_wexecvp|y|Filename:^w,ArgList:^^w||i
_wexecvpe|y|Filename:^w,ArgList:^^w,Env:^^w||i
_wfdopen|*@FILE;|FileHandle:i,Mode:^w||3
_wfindfirst32|y|Filename:^w,FindData:*@struct _wfinddata32_t;||g
_wfindfirst32i64|y|Filename:^w,FindData:*@struct _wfinddata32i64_t;||g
_wfindfirst64|y|Filename:^w,FindData:*@struct _wfinddata64_t;||g
_wfindfirst64i32|y|Filename:^w,FindData:*@struct _wfinddata64i32_t;||g
_wfindnext32|i|FindHandle:y,FindData:*@struct _wfinddata32_t;||g
_wfindnext32i64|i|FindHandle:y,FindData:*@struct _wfinddata32i64_t;||g
_wfindnext64|i|FindHandle:y,FindData:*@struct _wfinddata64_t;||g
_wfindnext64i32|i|FindHandle:y,FindData:*@struct _wfinddata64i32_t;||g
_wfopen|*@FILE;|Filename:^w,Mode:^w||3
_wfopen_s|i|File:**@FILE;,Filename:^w,Mode:^w||c
_wfreopen|*@FILE;|Filename:^w,Mode:^w,OldFile:*@FILE;||3
_wfreopen_s|i|File:**@FILE;,Filename:^w,Mode:^w,OldFile:*@FILE;||c
_wfsopen|*@FILE;|Filename:^w,Mode:^w,ShFlag:i||3
_wfullpath|*w|FullPath:*w,Path:^w,SizeInWords:z||0
_wgetcwd|*w|DstBuf:*w,SizeInWords:i||l
_wgetdcwd|*w|Drive:i,DstBuf:*w,SizeInWords:i||l
_wgetenv|*w|VarName:^w||0
_wgetenv_s|i|ReturnSize:*z,DstBuf:*w,DstSizeInWords:z,VarName:^w||r
_wmakepath|v|ResultPath:*w,Drive:^w,Dir:^w,Filename:^w,Ext:^w||0
_wmakepath_s|i|PathResult:*w,SizeInWords:z,Drive:^w,Dir:^w,Filename:^w,Ext:^w||r
_wmkdir|i|Path:^w||l
_wmktemp|*w|TemplateName:*w||g
_wmktemp_s|i|TemplateName:*w,SizeInWords:z||g
_wopen|i|Filename:^w,OpenFlag:i|v|g
_wperror|v|ErrMsg:^w||0
_wpopen|*@FILE;|Command:^w,Mode:^w||3
_wputenv|i|EnvString:^w||0
_wputenv_s|i|Name:^w,Value:^w||r
_wremove|i|Filename:^w||3
_wrename|i|OldFilename:^w,NewFilename:^w||g
_write|i|FileHandle:i,Buf:^v,MaxCharCount:u||g
_wrmdir|i|Path:^w||l
_wsearchenv|v|Filename:^w,EnvVar:^w,ResultPath:*w||0
_wsearchenv_s|i|Filename:^w,EnvVar:^w,ResultPath:*w,SizeInWords:z||r
_wsetlocale|*w|Category:i,Locale:^w||1
_wsopen|i|Filename:^w,OpenFlag:i,ShareFlag:i|v|g
_wsopen_s|i|FileHandle:*i,Filename:^w,OpenFlag:i,ShareFlag:i,PermissionFlag:i||g
_wspawnl|y|Mode:i,Filename:^w,ArgList:^w|v|i
_wspawnle|y|Mode:i,Filename:^w,ArgList:^w|v|i
_wspawnlp|y|Mode:i,Filename:^w,ArgList:^w|v|i
_wspawnlpe|y|Mode:i,Filename:^w,ArgList:^w|v|i
_wspawnv|y|Mode:i,Filename:^w,ArgList:^^w||i
_wspawnve|y|Mode:i,Filename:^w,ArgList:^^w,Env:^^w||i
_wspawnvp|y|Mode:i,Filename:^w,ArgList:^^w||i
_wspawnvpe|y|Mode:i,Filename:^w,ArgList:^^w,Env:^^w||i
_wsplitpath|v|FullPath:^w,Drive:*w,Dir:*w,Filename:*w,Ext:*w||0
_wsplitpath_s|i|FullPath:^w,Drive:*w,DriveSizeInWords:z,Dir:*w,DirSizeInWords:z,Filename:*w,FilenameSizeInWords:z,Ext:*w,ExtSizeInWords:z||r
_wstat32|i|Name:^w,Stat:*@struct _stat32;||o
_wstat32i64|i|Name:^w,Stat:*@struct _stat32i64;||o
_wstat64|i|Name:^w,Stat:*@struct _stat64;||o
_wstat64i32|i|Name:^w,Stat:*@struct _stat64i32;||o
_wstrdate|*w|Buffer:*w||6
_wstrdate_s|i|Buf:*w,SizeInWords:z||6
_wstrtime|*w|Buffer:*w||6
_wstrtime_s|i|Buf:*w,SizeInWords:z||6
_wsystem|i|Command:^w||0
_wtempnam|*w|Directory:^w,FilePrefix:^w||3
_wtmpnam|*w|Buffer:*w||3
_wtmpnam_s|i|DstBuf:*w,SizeInWords:z||c
_wtof|d|Str:^w||0
_wtof_l|d|Str:^w,Locale:*@struct localeinfo_struct;||0
_wtoi|i|Str:^w||0
_wtoi64|q|Str:^w||0
_wtoi64_l|q|Str:^w,Locale:*@struct localeinfo_struct;||0
_wtoi_l|i|Str:^w,Locale:*@struct localeinfo_struct;||0
_wtol|l|Str:^w||0
_wtol_l|l|Str:^w,Locale:*@struct localeinfo_struct;||0
_wunlink|i|Filename:^w||g
_y0|d|X:d||b
_y1|d|X:d||b
_yn|d|X:i,Y:d||b
access|i|Filename:^c,AccessMode:i||g
asctime_s|i|Buf:*c,SizeInWords:z,Tm:^@struct tm;||6
bsearch_s|*v|Key:^v,Base:^v,NumOfElements:z,SizeOfElements:z,PtFuncCompare:p,Context:*v||m
chdir|i|Path:^c||l
chgsign|d|a1:d||b
chmod|i|Filename:^c,AccessMode:i||g
chsize|i|FileHandle:i,Size:l||g
clearerr_s|i|File:*@FILE;||c
close|i|FileHandle:i||g
creat|i|Filename:^c,PermissionMode:i||g
creat64|i|Filename:^c,PermissionMode:i||g
cwait|y|TermStat:*i,ProcHandle:y,Action:i||i
dup|i|FileHandle:i||g
dup2|i|FileHandleSrc:i,FileHandleDst:i||g
ecvt|*c|Val:d,NumOfDigits:i,PtDec:*i,PtSign:*i||0
eof|i|FileHandle:i||g
execl|i|Filename:^c,ArgList:^c|v|i
execle|i|Filename:^c,ArgList:^c|v|i
execlp|i|Filename:^c,ArgList:^c|v|i
execlpe|i|Filename:^c,ArgList:^c|v|i
execv|i|Filename:^c,ArgList:^*c||i
execve|i|Filename:^c,ArgList:^*c,Env:^*c||i
execvp|i|Filename:^c,ArgList:^*c||i
execvpe|i|Filename:^c,ArgList:^*c,Env:^*c||i
fcloseall|i|||3
fcvt|*c|Val:d,NumOfDec:i,PtDec:*i,PtSign:*i||0
fdopen|*@FILE;|FileHandle:i,Format:^c||3
fgetchar|i|||3
fgetpos|i|File:*@FILE;,Pos:*q||3
fgetpos64|i|File:*@FILE;,Pos:*q||3
filelength|l|FileHandle:i||g
fileno|i|File:*@FILE;||3
finite|i|a1:d||b
fopen64|*@FILE;|filename:^c,mode:^c||3
fopen_s|i|File:**@FILE;,Filename:^c,Mode:^c||c
fpclass|i|a1:d||b
fputchar|i|Ch:i||3
fread_s|z|DstBuf:*v,DstSize:z,ElementSize:z,Count:z,File:*@FILE;||c
freopen64|*@FILE;|Filename:^c,Mode:^c,File:*@FILE;||3
freopen_s|i|File:**@FILE;,Filename:^c,Mode:^c,Stream:*@FILE;||c
fseeko|i|File:*@FILE;,Offset:l,Origin:i||3
fseeko64|i|File:*@FILE;,Offset:q,Origin:i||3
fsetpos|i|File:*@FILE;,Pos:^q||3
fsetpos64|i|File:*@FILE;,Pos:^q||3
fstat|i|Desc:i,Stat:*@struct stat;||o
fstat64|i|Desc:i,Stat:*@struct stat64;||o
ftello|l|File:*@FILE;||3
ftello64|q|File:*@FILE;||3
ftime|i|a1:*@struct timeb;||p
ftruncate|i|fd:i,length:l||y
ftruncate64|i|a1:i,a2:q||y
gcvt|*c|Val:d,NumOfDigits:i,DstBuf:*c||0
getch|i|||4
getche|i|||4
getcwd|*c|DstBuf:*c,SizeInBytes:i||l
getenv_s|i|ReturnSize:*z,DstBuf:*c,DstSize:z,VarName:^c||m
getpid|i|||i
gets_s|*c|a1:*c,a2:z||c
getw|i|File:*@FILE;||3
is_wctype|i|C:$wint_t;,Type:$wctype_t;||7
isatty|i|FileHandle:i||g
isleadbyte|i|C:i||7
iswascii|i|C:$wint_t;||7
itoa|*c|Val:i,DstBuf:*c,Radix:i||0
j0|d|a1:d||b
j1|d|a1:d||b
jn|d|a1:i,a2:d||b
kbhit|i|||4
lfind|*v|Key:^v,Base:^v,NumOfElements:*u,SizeOfElements:u,PtFuncCompare:p||u
lsearch|*v|Key:^v,Base:*v,NumOfElements:*u,SizeOfElements:u,PtFuncCompare:p||u
lseek|l|FileHandle:i,Offset:l,Origin:i||g
lseek64|q|fd:i,offset:q,whence:i||g
ltoa|*c|Val:l,DstBuf:*c,Radix:i||0
mbrlen|z|Ch:^c,SizeInBytes:z,State:*@_Mbstatet;||d
mbrtowc|z|DstCh:*w,SrcCh:^c,SizeInBytes:z,State:*@_Mbstatet;||d
mbsinit|i|ps:^@_Mbstatet;||d
mbsrtowcs|z|Dest:*w,PSrc:*^c,Count:z,State:*@_Mbstatet;||d
mbsrtowcs_s|i|Retval:*z,Dst:*w,SizeInWords:z,PSrc:*^c,N:z,State:*@_Mbstatet;||z
mbstowcs_s|i|PtNumOfCharConverted:*z,DstBuf:*w,SizeInWords:z,SrcBuf:^c,MaxCount:z||m
memccpy|*v|Dst:*v,Src:^v,Val:i,Size:z||e
memcpy_s|i|dest:*v,numberOfElements:z,src:^v,count:z||e
memicmp|i|Buf1:^v,Buf2:^v,Size:z||e
memmove_s|i|dest:*v,numberOfElements:z,src:^v,count:z||f
mkdir|i|Path:^c||l
mktemp|*c|TemplateName:*c||g
onexit|p|Func:p||0
open|i|Filename:^c,OpenFlag:i|vo1|g
open64|i|Filename:^c,OpenFlag:i|v|g
putch|i|Ch:i||4
putenv|i|EnvString:^c||0
putw|i|Ch:i,File:*@FILE;||3
qsort_s|v|Base:*v,NumOfElements:z,SizeOfElements:z,PtFuncCompare:p,Context:*v||m
read|i|FileHandle:i,DstBuf:*v,MaxCharCount:u||g
rmdir|i|Path:^c||l
rmtmp|i|||3
setmode|i|FileHandle:i,Mode:i||g
sincos|v|x:d,p_sin:*d,p_cos:*d||b
sincosf|v|x:f,p_sin:*f,p_cos:*f||b
snprintf|i|stream:*c,n:z,format:^c|vf2|3
snwprintf|i|s:*w,n:z,format:^w|v|3
sopen|i|Filename:^c,OpenFlag:i,ShareFlag:i|v|g
spawnl|y|a1:i,Filename:^c,ArgList:^c|v|i
spawnle|y|a1:i,Filename:^c,ArgList:^c|v|i
spawnlp|y|a1:i,Filename:^c,ArgList:^c|v|i
spawnlpe|y|a1:i,Filename:^c,ArgList:^c|v|i
spawnv|y|a1:i,Filename:^c,ArgList:^*c||i
spawnve|y|a1:i,Filename:^c,ArgList:^*c,Env:^*c||i
spawnvp|y|a1:i,Filename:^c,ArgList:^*c||i
spawnvpe|y|a1:i,Filename:^c,ArgList:^*c,Env:^*c||i
stat|i|Filename:^c,Stat:*@struct stat;||o
stat64|i|Filename:^c,Stat:*@struct stat64;||o
strcasecmp|i|s1:^c,s2:^c||e
strcat_s|i|Dst:*c,SizeInBytes:z,Src:^c||f
strcmpi|i|Str1:^c,Str2:^c||e
strcpy_s|i|Dst:*c,SizeInBytes:z,Src:^c||f
strdup|*c|Src:^c||e
strerror_s|i|Buf:*c,SizeInBytes:z,ErrNum:i||f
stricmp|i|Str1:^c,Str2:^c||e
strlwr|*c|Str:*c||e
strncasecmp|i|s1:^c,s2:^c,n:z||e
strncat_s|i|Dst:*c,DstSizeInChars:z,Src:^c,MaxCount:z||f
strncpy_s|i|Dst:*c,DstSizeInChars:z,Src:^c,MaxCount:z||f
strnicmp|i|Str1:^c,Str:^c,MaxCount:z||e
strnlen|z|Str:^c,MaxCount:z||e
strnset|*c|Str:*c,Val:i,MaxCount:z||e
strrev|*c|Str:*c||e
strset|*c|Str:*c,Val:i||e
strtok_s|*c|Str:*c,Delim:^c,Context:**c||f
strupr|*c|Str:*c||e
swab|v|Buf1:*c,Buf2:*c,SizeInBytes:i||0
tell|l|FileHandle:i||g
tempnam|*c|Directory:^c,FilePrefix:^c||3
tmpfile64|*@FILE;|||3
tmpfile_s|i|File:**@FILE;||c
tmpnam_s|i|a1:*c,a2:z||c
towctrans|$wint_t;|a1:$wint_t;,a2:w||10
tzset|v|||6
umask|i|Mode:i||g
ungetch|i|Ch:i||4
unlink|i|Filename:^c||g
vfscanf|i|stream:*@FILE;,format:^c,local_argv:x||3
vfwscanf|i|stream:*@FILE;,format:^w,local_argv:x||3
vscanf|i|format:^c,local_argv:x||3
vsnprintf|i|stream:*c,n:z,format:^c,local_argv:x||3
vsnwprintf|i|s:*w,n:z,format:^w,arg:x||3
vsscanf|i|source:^c,format:^c,local_argv:x||3
vswscanf|i|source:^w,format:^w,local_argv:x||3
vwscanf|i|format:^w,local_argv:x||3
wcrtomb|z|Dest:*c,Source:w,State:*@_Mbstatet;||d
wcrtomb_s|i|Retval:*z,Dst:*c,SizeInBytes:z,Ch:w,State:*@_Mbstatet;||z
wcscat_s|i|Dst:*w,SizeInWords:z,Src:^w||f
wcschr|*t|Str:^w,Ch:w||e
wcscpy_s|i|Dst:*w,SizeInWords:z,Src:^w||f
wcsdup|*w|Str:^w||e
wcsicmp|i|Str1:^w,Str2:^w||e
wcsicoll|i|Str1:^w,Str2:^w||e
wcslwr|*w|Str:*w||e
wcsncat_s|i|Dst:*w,DstSizeInChars:z,Src:^w,MaxCount:z||f
wcsncpy_s|i|Dst:*w,DstSizeInChars:z,Src:^w,MaxCount:z||f
wcsnicmp|i|Str1:^w,Str2:^w,MaxCount:z||e
wcsnlen|z|Src:^w,MaxCount:z||e
wcsnset|*w|Str:*w,Val:w,MaxCount:z||e
wcsrev|*w|Str:*w||e
wcsrtombs|z|Dest:*c,PSource:*^w,Count:z,State:*@_Mbstatet;||d
wcsrtombs_s|i|Retval:*z,Dst:*c,SizeInBytes:z,Src:*^w,Size:z,State:*@_Mbstatet;||z
wcsset|*w|Str:*w,Val:w||e
wcstof|f|nptr:^w,endptr:**w||0
wcstok_s|*w|Str:*w,Delim:^w,Context:**w||f
wcstoll|q|nptr:^w,endptr:**w,base:i||d
wcstombs_s|i|PtNumOfCharConverted:*z,Dst:*c,DstSizeInBytes:z,Src:^w,MaxCountInBytes:z||m
wcstoull|r|nptr:^w,endptr:**w,base:i||d
wcsupr|*w|Str:*w||e
wctomb_s|i|SizeConverted:*i,MbCh:*c,SizeInBytes:z,WCh:w||m
wctrans|w|a1:^c||10
wmemcpy_s|i|dest:*w,numberOfElements:z,src:^w,count:z||z
wmemmove_s|i|dest:*w,numberOfElements:z,src:^w,count:z||z
write|i|Filehandle:i,Buf:^v,MaxCharCount:u||g
wstat|i|Filename:^w,Stat:*@struct stat;||o
wstat64|i|Filename:^w,Stat:*@struct stat64;||o
y0|d|a1:d||b
y1|d|a1:d||b
yn|d|a1:i,a2:d||b
`;var Yr=Object.freeze({__proto__:null,data:Kr,headers:Vr,provenance:Gr});const jr="mingw-w64 unknown include",qr=["synchapi.h","winbase.h","consoleapi3.h","libloaderapi.h","securitybaseapi.h","namespaceapi.h","errhandlingapi.h","consoleapi.h","memoryapi.h","fileapi.h","utilapiset.h","threadpoolapiset.h","ioapiset.h","threadpoollegacyapiset.h","debugapi.h","handleapi.h","winnls.h","stringapiset.h","namedpipeapi.h","consoleapi2.h","processthreadsapi.h","tlhelp32.h","sysinfoapi.h","processenv.h","timezoneapi.h","fibersapi.h","securityappcontainer.h","datetimeapi.h","systemtopologyapi.h","processtopologyapi.h","heapapi.h","wow64apiset.h","interlockedapi.h","psdk_inc/intrin-impl.h","jobapi.h","psapi.h","winnt.h","realtimeapiset.h","profileapi.h","winver.h","excpt.h","stralign.h"],Xr=`&HANDLE=v
&HINSTANCE=@struct HINSTANCE__;
&HRSRC=@struct HRSRC__;
&HWND=@struct HWND__;
AcquireSRWLockExclusive|v|SRWLock:*@RTL_SRWLOCK;||0
AcquireSRWLockShared|v|SRWLock:*@RTL_SRWLOCK;||0
ActivateActCtx|i|hActCtx:&HANDLE;,lpCookie:*r||1
AddAtomA|t|lpString:^c||1
AddAtomW|t|lpString:^w||1
AddConsoleAliasA|i|source:*c,target:*c,exe_name:*c||2
AddConsoleAliasW|i|source:*w,target:*w,exe_name:*w||2
AddDllDirectory|*v|NewDirectory:^w||3
AddIntegrityLabelToBoundaryDescriptor|i|BoundaryDescriptor:*&HANDLE;,IntegrityLabel:*v||1
AddRefActCtx|v|hActCtx:&HANDLE;||1
AddResourceAttributeAce|i|pAcl:*@ACL;,dwAceRevision:m,AceFlags:m,AccessMask:m,pSid:*v,pAttributeInfo:*@struct _CLAIM_SECURITY_ATTRIBUTES_INFORMATION;,pReturnLength:*m||4
AddSIDToBoundaryDescriptor|i|BoundaryDescriptor:*&HANDLE;,RequiredSid:*v||5
AddScopedPolicyIDAce|i|pAcl:*@ACL;,dwAceRevision:m,AceFlags:m,AccessMask:m,pSid:*v||4
AddSecureMemoryCacheCallback|i|pfnCallBack:p||1
AddVectoredContinueHandler|*v|First:m,Handler:p||6
AddVectoredExceptionHandler|*v|First:m,Handler:p||6
AllocConsole|i|||7
AllocateUserPhysicalPages|i|hProcess:&HANDLE;,NumberOfPages:*r,PageArray:*r||8
AllocateUserPhysicalPagesNuma|i|hProcess:&HANDLE;,NumberOfPages:*r,PageArray:*r,nndPreferred:m||8
ApplicationRecoveryFinished|v|bSuccess:i||1
ApplicationRecoveryInProgress|l|pbCancelled:*i||1
AreFileApisANSI|i|||1
AreShortNamesEnabled|i|Handle:&HANDLE;,Enabled:*i||9
AssignProcessToJobObject|i|hJob:&HANDLE;,hProcess:&HANDLE;||1
AttachConsole|i|process_id:m||7
BackupRead|i|hFile:&HANDLE;,lpBuffer:*h,nNumberOfBytesToRead:m,lpNumberOfBytesRead:*m,bAbort:i,bProcessSecurity:i,lpContext:**v||1
BackupSeek|i|hFile:&HANDLE;,dwLowBytesToSeek:m,dwHighBytesToSeek:m,lpdwLowByteSeeked:*m,lpdwHighByteSeeked:*m,lpContext:**v||1
BackupWrite|i|hFile:&HANDLE;,lpBuffer:*h,nNumberOfBytesToWrite:m,lpNumberOfBytesWritten:*m,bAbort:i,bProcessSecurity:i,lpContext:**v||1
Beep|i|dwFreq:m,dwDuration:m||a
BeginUpdateResourceA|&HANDLE;|pFileName:^c,bDeleteExistingResources:i||1
BeginUpdateResourceW|&HANDLE;|pFileName:^w,bDeleteExistingResources:i||1
BindIoCompletionCallback|i|FileHandle:&HANDLE;,Function:p,Flags:m||1
BuildCommDCBA|i|lpDef:^c,lpDCB:*@struct _DCB;||1
BuildCommDCBAndTimeoutsA|i|lpDef:^c,lpDCB:*@struct _DCB;,lpCommTimeouts:*@struct _COMMTIMEOUTS;||1
BuildCommDCBAndTimeoutsW|i|lpDef:^w,lpDCB:*@struct _DCB;,lpCommTimeouts:*@struct _COMMTIMEOUTS;||1
BuildCommDCBW|i|lpDef:^w,lpDCB:*@struct _DCB;||1
CallNamedPipeA|i|lpNamedPipeName:^c,lpInBuffer:*v,nInBufferSize:m,lpOutBuffer:*v,nOutBufferSize:m,lpBytesRead:*m,nTimeOut:m||1
CallNamedPipeW|i|lpNamedPipeName:^w,lpInBuffer:*v,nInBufferSize:m,lpOutBuffer:*v,nOutBufferSize:m,lpBytesRead:*m,nTimeOut:m||1
CallbackMayRunLong|i|pci:*@struct _TP_CALLBACK_INSTANCE;||b
CancelDeviceWakeupRequest|i|hDevice:&HANDLE;||1
CancelIo|i|hFile:&HANDLE;||c
CancelIoEx|i|hFile:&HANDLE;,lpOverlapped:*@struct _OVERLAPPED;||c
CancelSynchronousIo|i|hThread:&HANDLE;||c
CancelThreadpoolIo|v|pio:*@struct _TP_IO;||b
CancelTimerQueueTimer|i|TimerQueue:&HANDLE;,Timer:&HANDLE;||1
CancelWaitableTimer|i|hTimer:&HANDLE;||0
ChangeTimerQueueTimer|i|TimerQueue:&HANDLE;,Timer:&HANDLE;,DueTime:m,Period:m||d
CheckNameLegalDOS8Dot3A|i|lpName:^c,lpOemName:*c,OemNameSize:m,pbNameContainsSpaces:*i,pbNameLegal:*i||1
CheckNameLegalDOS8Dot3W|i|lpName:^w,lpOemName:*c,OemNameSize:m,pbNameContainsSpaces:*i,pbNameLegal:*i||1
CheckRemoteDebuggerPresent|i|hProcess:&HANDLE;,pbDebuggerPresent:*i||e
CheckTokenCapability|i|TokenHandle:&HANDLE;,CapabilitySidToCheck:*v,HasCapability:*i||4
CheckTokenMembershipEx|i|TokenHandle:&HANDLE;,SidToCheck:*v,Flags:m,IsMember:*i||4
ClearCommBreak|i|hFile:&HANDLE;||1
ClearCommError|i|hFile:&HANDLE;,lpErrors:*m,lpStat:*@struct _COMSTAT;||1
CloseHandle|i|hObject:&HANDLE;||f
ClosePrivateNamespace|h|Handle:&HANDLE;,Flags:m||5
ClosePseudoConsole|v|pc:*v||7
CloseThreadpool|v|ptpp:*@struct _TP_POOL;||b
CloseThreadpoolCleanupGroup|v|ptpcg:*@struct _TP_CLEANUP_GROUP;||b
CloseThreadpoolCleanupGroupMembers|v|ptpcg:*@struct _TP_CLEANUP_GROUP;,fCancelPendingCallbacks:i,pvCleanupContext:*v||b
CloseThreadpoolIo|v|pio:*@struct _TP_IO;||b
CloseThreadpoolTimer|v|pti:*@struct _TP_TIMER;||b
CloseThreadpoolWait|v|pwa:*@struct _TP_WAIT;||b
CloseThreadpoolWork|v|pwk:*@struct _TP_WORK;||b
CommConfigDialogA|i|lpszName:^c,hWnd:&HWND;,lpCC:*@struct _COMMCONFIG;||1
CommConfigDialogW|i|lpszName:^w,hWnd:&HWND;,lpCC:*@struct _COMMCONFIG;||1
CompareFileTime|l|lpFileTime1:^@FILETIME;,lpFileTime2:^@FILETIME;||9
CompareStringA|i|Locale:m,dwCmpFlags:m,lpString1:^c,cchCount1:i,lpString2:^c,cchCount2:i||g
CompareStringEx|i|lpLocaleName:^w,dwCmpFlags:m,lpString1:^w,cchCount1:i,lpString2:^w,cchCount2:i,lpVersionInformation:*@struct _nlsversioninfo;,lpReserved:*v,lParam:q||h
CompareStringOrdinal|i|lpString1:^w,cchCount1:i,lpString2:^w,cchCount2:i,bIgnoreCase:i||h
CompareStringW|i|Locale:m,dwCmpFlags:m,lpString1:^w,cchCount1:i,lpString2:^w,cchCount2:i||h
ConnectNamedPipe|i|hNamedPipe:&HANDLE;,lpOverlapped:*@struct _OVERLAPPED;||i
ContinueDebugEvent|i|dwProcessId:m,dwThreadId:m,dwContinueStatus:m||e
ConvertDefaultLocale|m|Locale:m||g
ConvertFiberToThread|i|||1
ConvertThreadToFiber|*v|lpParameter:*v||1
ConvertThreadToFiberEx|*v|lpParameter:*v,dwFlags:m||1
CopyContext|i|Destination:*@struct _CONTEXT;,ContextFlags:m,Source:*@struct _CONTEXT;||1
CopyFile2|l|pwszExistingFileName:^w,pwszNewFileName:^w,pExtendedParameters:*@COPYFILE2_EXTENDED_PARAMETERS;||1
CopyFileA|i|lpExistingFileName:^c,lpNewFileName:^c,bFailIfExists:i||1
CopyFileExA|i|lpExistingFileName:^c,lpNewFileName:^c,lpProgressRoutine:p,lpData:*v,pbCancel:*i,dwCopyFlags:m||1
CopyFileExW|i|lpExistingFileName:^w,lpNewFileName:^w,lpProgressRoutine:p,lpData:*v,pbCancel:*i,dwCopyFlags:m||1
CopyFileTransactedA|i|lpExistingFileName:^c,lpNewFileName:^c,lpProgressRoutine:p,lpData:*v,pbCancel:*i,dwCopyFlags:m,hTransaction:&HANDLE;||1
CopyFileTransactedW|i|lpExistingFileName:^w,lpNewFileName:^w,lpProgressRoutine:p,lpData:*v,pbCancel:*i,dwCopyFlags:m,hTransaction:&HANDLE;||1
CopyFileW|i|lpExistingFileName:^w,lpNewFileName:^w,bFailIfExists:i||1
CreateActCtxA|&HANDLE;|pActCtx:^@ACTCTXA;||1
CreateActCtxW|&HANDLE;|pActCtx:^@ACTCTXW;||1
CreateBoundaryDescriptorA|&HANDLE;|Name:^c,Flags:m||1
CreateBoundaryDescriptorW|&HANDLE;|Name:^w,Flags:m||5
CreateConsoleScreenBuffer|&HANDLE;|desired_access:m,share_mode:m,security_attributes:^@SECURITY_ATTRIBUTES;,flags:m,screen_buffer_data:*v||j
CreateDirectoryA|i|lpPathName:^c,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;||9
CreateDirectoryExA|i|lpTemplateDirectory:^c,lpNewDirectory:^c,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;||1
CreateDirectoryExW|i|lpTemplateDirectory:^w,lpNewDirectory:^w,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;||1
CreateDirectoryTransactedA|i|lpTemplateDirectory:^c,lpNewDirectory:^c,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,hTransaction:&HANDLE;||1
CreateDirectoryTransactedW|i|lpTemplateDirectory:^w,lpNewDirectory:^w,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,hTransaction:&HANDLE;||1
CreateDirectoryW|i|lpPathName:^w,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;||9
CreateEventA|&HANDLE;|lpEventAttributes:*@struct _SECURITY_ATTRIBUTES;,bManualReset:i,bInitialState:i,lpName:^c||0
CreateEventExA|&HANDLE;|lpEventAttributes:*@struct _SECURITY_ATTRIBUTES;,lpName:^c,dwFlags:m,dwDesiredAccess:m||0
CreateEventExW|&HANDLE;|lpEventAttributes:*@struct _SECURITY_ATTRIBUTES;,lpName:^w,dwFlags:m,dwDesiredAccess:m||0
CreateEventW|&HANDLE;|lpEventAttributes:*@struct _SECURITY_ATTRIBUTES;,bManualReset:i,bInitialState:i,lpName:^w||0
CreateFiber|*v|dwStackSize:z,lpStartAddress:p,lpParameter:*v||1
CreateFiberEx|*v|dwStackCommitSize:z,dwStackReserveSize:z,dwFlags:m,lpStartAddress:p,lpParameter:*v||1
CreateFile2|&HANDLE;|lpFileName:^w,dwDesiredAccess:m,dwShareMode:m,dwCreationDisposition:m,pCreateExParams:*@struct _CREATEFILE2_EXTENDED_PARAMETERS;||9
CreateFileA|&HANDLE;|lpFileName:^c,dwDesiredAccess:m,dwShareMode:m,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,dwCreationDisposition:m,dwFlagsAndAttributes:m,hTemplateFile:&HANDLE;||9
CreateFileMappingA|&HANDLE;|hFile:&HANDLE;,lpFileMappingAttributes:*@struct _SECURITY_ATTRIBUTES;,flProtect:m,dwMaximumSizeHigh:m,dwMaximumSizeLow:m,lpName:^c||1
CreateFileMappingFromApp|&HANDLE;|hFile:&HANDLE;,SecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,PageProtection:m,MaximumSize:r,Name:^w||8
CreateFileMappingNumaA|&HANDLE;|hFile:&HANDLE;,lpFileMappingAttributes:*@struct _SECURITY_ATTRIBUTES;,flProtect:m,dwMaximumSizeHigh:m,dwMaximumSizeLow:m,lpName:^c,nndPreferred:m||1
CreateFileMappingNumaW|&HANDLE;|hFile:&HANDLE;,lpFileMappingAttributes:*@struct _SECURITY_ATTRIBUTES;,flProtect:m,dwMaximumSizeHigh:m,dwMaximumSizeLow:m,lpName:^w,nndPreferred:m||8
CreateFileMappingW|&HANDLE;|hFile:&HANDLE;,lpFileMappingAttributes:*@struct _SECURITY_ATTRIBUTES;,flProtect:m,dwMaximumSizeHigh:m,dwMaximumSizeLow:m,lpName:^w||8
CreateFileTransactedA|&HANDLE;|lpFileName:^c,dwDesiredAccess:m,dwShareMode:m,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,dwCreationDisposition:m,dwFlagsAndAttributes:m,hTemplateFile:&HANDLE;,hTransaction:&HANDLE;,pusMiniVersion:*t,lpExtendedParameter:*v||1
CreateFileTransactedW|&HANDLE;|lpFileName:^w,dwDesiredAccess:m,dwShareMode:m,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,dwCreationDisposition:m,dwFlagsAndAttributes:m,hTemplateFile:&HANDLE;,hTransaction:&HANDLE;,pusMiniVersion:*t,lpExtendedParameter:*v||1
CreateFileW|&HANDLE;|lpFileName:^w,dwDesiredAccess:m,dwShareMode:m,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,dwCreationDisposition:m,dwFlagsAndAttributes:m,hTemplateFile:&HANDLE;||9
CreateHardLinkA|i|lpFileName:^c,lpExistingFileName:^c,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;||1
CreateHardLinkTransactedA|i|lpFileName:^c,lpExistingFileName:^c,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,hTransaction:&HANDLE;||1
CreateHardLinkTransactedW|i|lpFileName:^w,lpExistingFileName:^w,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,hTransaction:&HANDLE;||1
CreateHardLinkW|i|lpFileName:^w,lpExistingFileName:^w,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;||1
CreateIoCompletionPort|&HANDLE;|FileHandle:&HANDLE;,ExistingCompletionPort:&HANDLE;,CompletionKey:r,NumberOfConcurrentThreads:m||c
CreateJobObjectA|&HANDLE;|lpJobAttributes:*@struct _SECURITY_ATTRIBUTES;,lpName:^c||1
CreateJobObjectW|&HANDLE;|lpJobAttributes:*@struct _SECURITY_ATTRIBUTES;,lpName:^w||1
CreateJobSet|i|NumJob:m,UserJobSet:*@struct _JOB_SET_ARRAY;,Flags:m||1
CreateMailslotA|&HANDLE;|lpName:^c,nMaxMessageSize:m,lReadTimeout:m,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;||1
CreateMailslotW|&HANDLE;|lpName:^w,nMaxMessageSize:m,lReadTimeout:m,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;||1
CreateMemoryResourceNotification|&HANDLE;|NotificationType:u||8
CreateMutexA|&HANDLE;|lpMutexAttributes:*@struct _SECURITY_ATTRIBUTES;,bInitialOwner:i,lpName:^c||0
CreateMutexExA|&HANDLE;|lpMutexAttributes:*@struct _SECURITY_ATTRIBUTES;,lpName:^c,dwFlags:m,dwDesiredAccess:m||0
CreateMutexExW|&HANDLE;|lpMutexAttributes:*@struct _SECURITY_ATTRIBUTES;,lpName:^w,dwFlags:m,dwDesiredAccess:m||0
CreateMutexW|&HANDLE;|lpMutexAttributes:*@struct _SECURITY_ATTRIBUTES;,bInitialOwner:i,lpName:^w||0
CreateNamedPipeA|&HANDLE;|lpName:^c,dwOpenMode:m,dwPipeMode:m,nMaxInstances:m,nOutBufferSize:m,nInBufferSize:m,nDefaultTimeOut:m,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;||1
CreateNamedPipeW|&HANDLE;|lpName:^w,dwOpenMode:m,dwPipeMode:m,nMaxInstances:m,nOutBufferSize:m,nInBufferSize:m,nDefaultTimeOut:m,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;||i
CreatePipe|i|hReadPipe:*&HANDLE;,hWritePipe:*&HANDLE;,lpPipeAttributes:*@struct _SECURITY_ATTRIBUTES;,nSize:m||i
CreatePrivateNamespaceA|&HANDLE;|lpPrivateNamespaceAttributes:*@struct _SECURITY_ATTRIBUTES;,lpBoundaryDescriptor:*v,lpAliasPrefix:^c||1
CreatePrivateNamespaceW|&HANDLE;|lpPrivateNamespaceAttributes:*@struct _SECURITY_ATTRIBUTES;,lpBoundaryDescriptor:*v,lpAliasPrefix:^w||5
CreateProcessA|i|lpApplicationName:^c,lpCommandLine:*c,lpProcessAttributes:*@struct _SECURITY_ATTRIBUTES;,lpThreadAttributes:*@struct _SECURITY_ATTRIBUTES;,bInheritHandles:i,dwCreationFlags:m,lpEnvironment:*v,lpCurrentDirectory:^c,lpStartupInfo:*@struct _STARTUPINFOA;,lpProcessInformation:*@struct _PROCESS_INFORMATION;||k
CreateProcessW|i|lpApplicationName:^w,lpCommandLine:*w,lpProcessAttributes:*@struct _SECURITY_ATTRIBUTES;,lpThreadAttributes:*@struct _SECURITY_ATTRIBUTES;,bInheritHandles:i,dwCreationFlags:m,lpEnvironment:*v,lpCurrentDirectory:^w,lpStartupInfo:*@struct _STARTUPINFOW;,lpProcessInformation:*@struct _PROCESS_INFORMATION;||k
CreateRemoteThread|&HANDLE;|hProcess:&HANDLE;,lpThreadAttributes:*@struct _SECURITY_ATTRIBUTES;,dwStackSize:z,lpStartAddress:p,lpParameter:*v,dwCreationFlags:m,lpThreadId:*m||k
CreateRemoteThreadEx|&HANDLE;|hProcess:&HANDLE;,lpThreadAttributes:*@struct _SECURITY_ATTRIBUTES;,dwStackSize:z,lpStartAddress:p,lpParameter:*v,dwCreationFlags:m,lpAttributeList:*@struct _PROC_THREAD_ATTRIBUTE_LIST;,lpThreadId:*m||k
CreateSemaphoreA|&HANDLE;|lpSemaphoreAttributes:*@struct _SECURITY_ATTRIBUTES;,lInitialCount:l,lMaximumCount:l,lpName:^c||1
CreateSemaphoreExA|&HANDLE;|lpSemaphoreAttributes:*@struct _SECURITY_ATTRIBUTES;,lInitialCount:l,lMaximumCount:l,lpName:^c,dwFlags:m,dwDesiredAccess:m||1
CreateSemaphoreExW|&HANDLE;|lpSemaphoreAttributes:*@struct _SECURITY_ATTRIBUTES;,lInitialCount:l,lMaximumCount:l,lpName:^w,dwFlags:m,dwDesiredAccess:m||0
CreateSemaphoreW|&HANDLE;|lpSemaphoreAttributes:*@struct _SECURITY_ATTRIBUTES;,lInitialCount:l,lMaximumCount:l,lpName:^w||1
CreateSymbolicLinkA|h|lpSymlinkFileName:^c,lpTargetFileName:^c,dwFlags:m||1
CreateSymbolicLinkTransactedA|h|lpSymlinkFileName:^c,lpTargetFileName:^c,dwFlags:m,hTransaction:&HANDLE;||1
CreateSymbolicLinkTransactedW|h|lpSymlinkFileName:^w,lpTargetFileName:^w,dwFlags:m,hTransaction:&HANDLE;||1
CreateSymbolicLinkW|h|lpSymlinkFileName:^w,lpTargetFileName:^w,dwFlags:m||1
CreateTapePartition|m|hDevice:&HANDLE;,dwPartitionMethod:m,dwCount:m,dwSize:m||1
CreateThread|&HANDLE;|lpThreadAttributes:*@struct _SECURITY_ATTRIBUTES;,dwStackSize:z,lpStartAddress:p,lpParameter:*v,dwCreationFlags:m,lpThreadId:*m||k
CreateThreadpool|*@struct _TP_POOL;|reserved:*v||b
CreateThreadpoolCleanupGroup|*@struct _TP_CLEANUP_GROUP;|||b
CreateThreadpoolIo|*@struct _TP_IO;|fl:&HANDLE;,pfnio:p,pv:*v,pcbe:*@TP_CALLBACK_ENVIRON_V3;||b
CreateThreadpoolTimer|*@struct _TP_TIMER;|pfnti:p,pv:*v,pcbe:*@TP_CALLBACK_ENVIRON_V3;||b
CreateThreadpoolWait|*@struct _TP_WAIT;|pfnwa:p,pv:*v,pcbe:*@TP_CALLBACK_ENVIRON_V3;||b
CreateThreadpoolWork|*@struct _TP_WORK;|pfnwk:p,pv:*v,pcbe:*@TP_CALLBACK_ENVIRON_V3;||b
CreateTimerQueue|&HANDLE;|||d
CreateTimerQueueTimer|i|phNewTimer:*&HANDLE;,TimerQueue:&HANDLE;,Callback:p,Parameter:*v,DueTime:m,Period:m,Flags:m||d
CreateToolhelp32Snapshot|&HANDLE;|dwFlags:m,th32ProcessID:m||l
CreateUmsCompletionList|i|UmsCompletionList:**v||1
CreateUmsThreadContext|i|lpUmsThread:**v||1
CreateWaitableTimerA|&HANDLE;|lpTimerAttributes:*@struct _SECURITY_ATTRIBUTES;,bManualReset:i,lpTimerName:^c||1
CreateWaitableTimerExA|&HANDLE;|lpTimerAttributes:*@struct _SECURITY_ATTRIBUTES;,lpTimerName:^c,dwFlags:m,dwDesiredAccess:m||1
CreateWaitableTimerExW|&HANDLE;|lpTimerAttributes:*@struct _SECURITY_ATTRIBUTES;,lpTimerName:^w,dwFlags:m,dwDesiredAccess:m||0
CreateWaitableTimerW|&HANDLE;|lpTimerAttributes:*@struct _SECURITY_ATTRIBUTES;,bManualReset:i,lpTimerName:^w||1
DeactivateActCtx|i|dwFlags:m,ulCookie:r||1
DebugActiveProcess|i|dwProcessId:m||e
DebugActiveProcessStop|i|dwProcessId:m||e
DebugBreak|v|||e
DebugBreakProcess|i|Process:&HANDLE;||1
DebugSetProcessKillOnExit|i|KillOnExit:i||1
DecodePointer|*v|Ptr:*v||a
DecodeSystemPointer|*v|Ptr:*v||a
DefineDosDeviceA|i|dwFlags:m,lpDeviceName:^c,lpTargetPath:^c||1
DefineDosDeviceW|i|dwFlags:m,lpDeviceName:^w,lpTargetPath:^w||9
DeleteAtom|t|nAtom:t||1
DeleteBoundaryDescriptor|v|BoundaryDescriptor:&HANDLE;||5
DeleteCriticalSection|v|lpCriticalSection:*@struct _RTL_CRITICAL_SECTION;||0
DeleteFiber|v|lpFiber:*v||1
DeleteFileA|i|lpFileName:^c||9
DeleteFileTransactedA|i|lpFileName:^c,hTransaction:&HANDLE;||1
DeleteFileTransactedW|i|lpFileName:^w,hTransaction:&HANDLE;||1
DeleteFileW|i|lpFileName:^w||9
DeleteProcThreadAttributeList|v|lpAttributeList:*@struct _PROC_THREAD_ATTRIBUTE_LIST;||k
DeleteSynchronizationBarrier|i|lpBarrier:*@struct _RTL_BARRIER;||0
DeleteTimerQueue|i|TimerQueue:&HANDLE;||1
DeleteTimerQueueEx|i|TimerQueue:&HANDLE;,CompletionEvent:&HANDLE;||d
DeleteTimerQueueTimer|i|TimerQueue:&HANDLE;,Timer:&HANDLE;,CompletionEvent:&HANDLE;||d
DeleteUmsCompletionList|i|UmsCompletionList:*v||1
DeleteUmsThreadContext|i|UmsThread:*v||1
DeleteVolumeMountPointA|i|lpszVolumeMountPoint:^c||1
DeleteVolumeMountPointW|i|lpszVolumeMountPoint:^w||9
DequeueUmsCompletionListItems|i|UmsCompletionList:*v,WaitTimeOut:m,UmsThreadList:**v||1
DeviceIoControl|i|hDevice:&HANDLE;,dwIoControlCode:m,lpInBuffer:*v,nInBufferSize:m,lpOutBuffer:*v,nOutBufferSize:m,lpBytesReturned:*m,lpOverlapped:*@struct _OVERLAPPED;||c
DisableThreadLibraryCalls|i|hLibModule:&HINSTANCE;||3
DisableThreadProfiling|m|PerformanceDataHandle:&HANDLE;||1
DisassociateCurrentThreadFromCallback|v|pci:*@struct _TP_CALLBACK_INSTANCE;||b
DiscardVirtualMemory|m|VirtualAddress:*v,Size:z||8
DisconnectNamedPipe|i|hNamedPipe:&HANDLE;||i
DnsHostnameToComputerNameA|i|Hostname:^c,ComputerName:*c,nSize:*m||1
DnsHostnameToComputerNameW|i|Hostname:^w,ComputerName:*w,nSize:*m||1
DosDateTimeToFileTime|i|wFatDate:t,wFatTime:t,lpFileTime:*@struct _FILETIME;||1
DuplicateHandle|i|hSourceProcessHandle:&HANDLE;,hSourceHandle:&HANDLE;,hTargetProcessHandle:&HANDLE;,lpTargetHandle:*&HANDLE;,dwDesiredAccess:m,bInheritHandle:i,dwOptions:m||f
EnableProcessOptionalXStateFeatures|i|Features:r||1
EnableThreadProfiling|m|ThreadHandle:&HANDLE;,Flags:m,HardwareCounters:r,PerformanceDataHandle:*&HANDLE;||1
EncodePointer|*v|Ptr:*v||a
EncodeSystemPointer|*v|Ptr:*v||a
EndUpdateResourceA|i|hUpdate:&HANDLE;,fDiscard:i||1
EndUpdateResourceW|i|hUpdate:&HANDLE;,fDiscard:i||1
EnterCriticalSection|v|lpCriticalSection:*@struct _RTL_CRITICAL_SECTION;||0
EnterSynchronizationBarrier|i|lpBarrier:*@struct _RTL_BARRIER;,dwFlags:m||0
EnterUmsSchedulingMode|i|SchedulerStartupInfo:*@struct _UMS_SCHEDULER_STARTUP_INFO;||1
EnumCalendarInfoA|i|lpCalInfoEnumProc:p,Locale:m,Calendar:m,CalType:m||g
EnumCalendarInfoExA|i|lpCalInfoEnumProcEx:p,Locale:m,Calendar:m,CalType:m||g
EnumCalendarInfoExEx|i|pCalInfoEnumProcExEx:p,lpLocaleName:^w,Calendar:m,lpReserved:^w,CalType:m,lParam:q||g
EnumCalendarInfoExW|i|lpCalInfoEnumProcEx:p,Locale:m,Calendar:m,CalType:m||g
EnumCalendarInfoW|i|lpCalInfoEnumProc:p,Locale:m,Calendar:m,CalType:m||g
EnumDateFormatsA|i|lpDateFmtEnumProc:p,Locale:m,dwFlags:m||g
EnumDateFormatsExA|i|lpDateFmtEnumProcEx:p,Locale:m,dwFlags:m||g
EnumDateFormatsExEx|i|lpDateFmtEnumProcExEx:p,lpLocaleName:^w,dwFlags:m,lParam:q||g
EnumDateFormatsExW|i|lpDateFmtEnumProcEx:p,Locale:m,dwFlags:m||g
EnumDateFormatsW|i|lpDateFmtEnumProc:p,Locale:m,dwFlags:m||g
EnumLanguageGroupLocalesA|i|lpLangGroupLocaleEnumProc:p,LanguageGroup:m,dwFlags:m,lParam:q||g
EnumLanguageGroupLocalesW|i|lpLangGroupLocaleEnumProc:p,LanguageGroup:m,dwFlags:m,lParam:q||g
EnumResourceLanguagesA|i|hModule:&HINSTANCE;,lpType:^c,lpName:^c,lpEnumFunc:p,lParam:q||3
EnumResourceLanguagesExA|i|hModule:&HINSTANCE;,lpType:^c,lpName:^c,lpEnumFunc:p,lParam:q,dwFlags:m,LangId:t||3
EnumResourceLanguagesExW|i|hModule:&HINSTANCE;,lpType:^w,lpName:^w,lpEnumFunc:p,lParam:q,dwFlags:m,LangId:t||3
EnumResourceLanguagesW|i|hModule:&HINSTANCE;,lpType:^w,lpName:^w,lpEnumFunc:p,lParam:q||3
EnumResourceNamesA|i|hModule:&HINSTANCE;,lpType:^c,lpEnumFunc:p,lParam:q||1
EnumResourceNamesExA|i|hModule:&HINSTANCE;,lpType:^c,lpEnumFunc:p,lParam:q,dwFlags:m,LangId:t||3
EnumResourceNamesExW|i|hModule:&HINSTANCE;,lpType:^w,lpEnumFunc:p,lParam:q,dwFlags:m,LangId:t||3
EnumResourceNamesW|i|hModule:&HINSTANCE;,lpType:^w,lpEnumFunc:p,lParam:q||3
EnumResourceTypesA|i|hModule:&HINSTANCE;,lpEnumFunc:p,lParam:q||1
EnumResourceTypesExA|i|hModule:&HINSTANCE;,lpEnumFunc:p,lParam:q,dwFlags:m,LangId:t||3
EnumResourceTypesExW|i|hModule:&HINSTANCE;,lpEnumFunc:p,lParam:q,dwFlags:m,LangId:t||3
EnumResourceTypesW|i|hModule:&HINSTANCE;,lpEnumFunc:p,lParam:q||1
EnumSystemCodePagesA|i|lpCodePageEnumProc:p,dwFlags:m||g
EnumSystemCodePagesW|i|lpCodePageEnumProc:p,dwFlags:m||g
EnumSystemFirmwareTables|u|FirmwareTableProviderSignature:m,pFirmwareTableEnumBuffer:*v,BufferSize:m||m
EnumSystemGeoID|i|GeoClass:m,ParentGeoId:l,lpGeoEnumProc:p||g
EnumSystemGeoNames|i|geoClass:m,geoEnumProc:p,data:q||g
EnumSystemLanguageGroupsA|i|lpLanguageGroupEnumProc:p,dwFlags:m,lParam:q||g
EnumSystemLanguageGroupsW|i|lpLanguageGroupEnumProc:p,dwFlags:m,lParam:q||g
EnumSystemLocalesA|i|lpLocaleEnumProc:p,dwFlags:m||g
EnumSystemLocalesEx|i|lpLocaleEnumProcEx:p,dwFlags:m,lParam:q,lpReserved:*v||g
EnumSystemLocalesW|i|lpLocaleEnumProc:p,dwFlags:m||g
EnumTimeFormatsA|i|lpTimeFmtEnumProc:p,Locale:m,dwFlags:m||g
EnumTimeFormatsEx|i|lpTimeFmtEnumProcEx:p,lpLocaleName:^w,dwFlags:m,lParam:q||g
EnumTimeFormatsW|i|lpTimeFmtEnumProc:p,Locale:m,dwFlags:m||g
EnumUILanguagesA|i|lpUILanguageEnumProc:p,dwFlags:m,lParam:q||g
EnumUILanguagesW|i|lpUILanguageEnumProc:p,dwFlags:m,lParam:q||g
EraseTape|m|hDevice:&HANDLE;,dwEraseType:m,bImmediate:i||1
EscapeCommFunction|i|hFile:&HANDLE;,dwFunc:m||1
ExecuteUmsThread|i|UmsThread:*v||1
ExitProcess|v|uExitCode:u|n|k
ExitThread|v|dwExitCode:m|n|k
ExpandEnvironmentStringsA|m|lpSrc:^c,lpDst:*c,nSize:m||n
ExpandEnvironmentStringsW|m|lpSrc:^w,lpDst:*w,nSize:m||n
ExpungeConsoleCommandHistoryA|v|exe_name:*c||2
ExpungeConsoleCommandHistoryW|v|exe_name:*w||2
FatalAppExitA|v|uAction:u,lpMessageText:^c||1
FatalAppExitW|v|uAction:u,lpMessageText:^w||1
FatalExit|v|ExitCode:i||1
FileTimeToDosDateTime|i|lpFileTime:^@FILETIME;,lpFatDate:*t,lpFatTime:*t||1
FileTimeToLocalFileTime|i|lpFileTime:^@FILETIME;,lpLocalFileTime:*@struct _FILETIME;||9
FileTimeToSystemTime|i|lpFileTime:^@FILETIME;,lpSystemTime:*@struct _SYSTEMTIME;||o
FindActCtxSectionGuid|i|dwFlags:m,lpExtensionGuid:^@GUID;,ulSectionId:m,lpGuidToFind:^@GUID;,ReturnedData:*@struct tagACTCTX_SECTION_KEYED_DATA;||1
FindActCtxSectionStringA|i|dwFlags:m,lpExtensionGuid:^@GUID;,ulSectionId:m,lpStringToFind:^c,ReturnedData:*@struct tagACTCTX_SECTION_KEYED_DATA;||1
FindActCtxSectionStringW|i|dwFlags:m,lpExtensionGuid:^@GUID;,ulSectionId:m,lpStringToFind:^w,ReturnedData:*@struct tagACTCTX_SECTION_KEYED_DATA;||1
FindAtomA|t|lpString:^c||1
FindAtomW|t|lpString:^w||1
FindClose|i|hFindFile:&HANDLE;||9
FindCloseChangeNotification|i|hChangeHandle:&HANDLE;||9
FindFirstChangeNotificationA|&HANDLE;|lpPathName:^c,bWatchSubtree:i,dwNotifyFilter:m||9
FindFirstChangeNotificationW|&HANDLE;|lpPathName:^w,bWatchSubtree:i,dwNotifyFilter:m||9
FindFirstFileA|&HANDLE;|lpFileName:^c,lpFindFileData:*@struct _WIN32_FIND_DATAA;||9
FindFirstFileExA|&HANDLE;|lpFileName:^c,fInfoLevelId:u,lpFindFileData:*v,fSearchOp:u,lpSearchFilter:*v,dwAdditionalFlags:m||9
FindFirstFileExW|&HANDLE;|lpFileName:^w,fInfoLevelId:u,lpFindFileData:*v,fSearchOp:u,lpSearchFilter:*v,dwAdditionalFlags:m||9
FindFirstFileNameTransactedW|&HANDLE;|lpFileName:^w,dwFlags:m,StringLength:*m,LinkName:*w,hTransaction:&HANDLE;||1
FindFirstFileNameW|&HANDLE;|lpFileName:^w,dwFlags:m,StringLength:*m,LinkName:*w||1
FindFirstFileTransactedA|&HANDLE;|lpFileName:^c,fInfoLevelId:u,lpFindFileData:*v,fSearchOp:u,lpSearchFilter:*v,dwAdditionalFlags:m,hTransaction:&HANDLE;||1
FindFirstFileTransactedW|&HANDLE;|lpFileName:^w,fInfoLevelId:u,lpFindFileData:*v,fSearchOp:u,lpSearchFilter:*v,dwAdditionalFlags:m,hTransaction:&HANDLE;||1
FindFirstFileW|&HANDLE;|lpFileName:^w,lpFindFileData:*@struct _WIN32_FIND_DATAW;||9
FindFirstStreamTransactedW|&HANDLE;|lpFileName:^w,InfoLevel:u,lpFindStreamData:*v,dwFlags:m,hTransaction:&HANDLE;||1
FindFirstStreamW|&HANDLE;|lpFileName:^w,InfoLevel:u,lpFindStreamData:*v,dwFlags:m||1
FindFirstVolumeA|&HANDLE;|lpszVolumeName:*c,cchBufferLength:m||1
FindFirstVolumeMountPointA|&HANDLE;|lpszRootPathName:^c,lpszVolumeMountPoint:*c,cchBufferLength:m||1
FindFirstVolumeMountPointW|&HANDLE;|lpszRootPathName:^w,lpszVolumeMountPoint:*w,cchBufferLength:m||1
FindFirstVolumeW|&HANDLE;|lpszVolumeName:*w,cchBufferLength:m||9
FindNLSString|i|Locale:m,dwFindNLSStringFlags:m,lpStringSource:^w,cchSource:i,lpStringValue:^w,cchValue:i,pcchFound:*i||g
FindNLSStringEx|i|lpLocaleName:^w,dwFindNLSStringFlags:m,lpStringSource:^w,cchSource:i,lpStringValue:^w,cchValue:i,pcchFound:*i,lpVersionInformation:*@struct _nlsversioninfo;,lpReserved:*v,sortHandle:q||g
FindNextChangeNotification|i|hChangeHandle:&HANDLE;||9
FindNextFileA|i|hFindFile:&HANDLE;,lpFindFileData:*@struct _WIN32_FIND_DATAA;||9
FindNextFileNameW|i|hFindStream:&HANDLE;,StringLength:*m,LinkName:*w||1
FindNextFileW|i|hFindFile:&HANDLE;,lpFindFileData:*@struct _WIN32_FIND_DATAW;||9
FindNextStreamW|i|hFindStream:&HANDLE;,lpFindStreamData:*v||1
FindNextVolumeA|i|hFindVolume:&HANDLE;,lpszVolumeName:*c,cchBufferLength:m||1
FindNextVolumeMountPointA|i|hFindVolumeMountPoint:&HANDLE;,lpszVolumeMountPoint:*c,cchBufferLength:m||1
FindNextVolumeMountPointW|i|hFindVolumeMountPoint:&HANDLE;,lpszVolumeMountPoint:*w,cchBufferLength:m||1
FindNextVolumeW|i|hFindVolume:&HANDLE;,lpszVolumeName:*w,cchBufferLength:m||9
FindResourceA|&HRSRC;|hModule:&HINSTANCE;,lpName:^c,lpType:^c||1
FindResourceExA|&HRSRC;|hModule:&HINSTANCE;,lpType:^c,lpName:^c,wLanguage:t||1
FindResourceExW|&HRSRC;|hModule:&HINSTANCE;,lpType:^w,lpName:^w,wLanguage:t||3
FindResourceW|&HRSRC;|hModule:&HINSTANCE;,lpName:^w,lpType:^w||3
FindStringOrdinal|i|dwFindStringOrdinalFlags:m,lpStringSource:^w,cchSource:i,lpStringValue:^w,cchValue:i,bIgnoreCase:i||3
FindVolumeClose|i|hFindVolume:&HANDLE;||9
FindVolumeMountPointClose|i|hFindVolumeMountPoint:&HANDLE;||1
FlsAlloc|m|lpCallback:p||p
FlsFree|i|dwFlsIndex:m||p
FlsGetValue|*v|dwFlsIndex:m||p
FlsGetValue2|*v|dwTlsIndex:m||p
FlsSetValue|i|dwFlsIndex:m,lpFlsData:*v||p
FlushConsoleInputBuffer|i|console_input:&HANDLE;||j
FlushFileBuffers|i|hFile:&HANDLE;||9
FlushInstructionCache|i|hProcess:&HANDLE;,lpBaseAddress:^v,dwSize:z||k
FlushProcessWriteBuffers|v|||k
FlushViewOfFile|i|lpBaseAddress:^v,dwNumberOfBytesToFlush:z||8
FoldStringA|i|dwMapFlags:m,lpSrcStr:^c,cchSrc:i,lpDestStr:*c,cchDest:i||g
FoldStringW|i|dwMapFlags:m,lpSrcStr:^w,cchSrc:i,lpDestStr:*w,cchDest:i||h
FormatMessageA|m|dwFlags:m,lpSource:^v,dwMessageId:m,dwLanguageId:m,lpBuffer:*c,nSize:m,Arguments:*x||1
FormatMessageW|m|dwFlags:m,lpSource:^v,dwMessageId:m,dwLanguageId:m,lpBuffer:*w,nSize:m,Arguments:*x||1
FreeConsole|i|||7
FreeEnvironmentStringsA|i|penv:*c||n
FreeEnvironmentStringsW|i|penv:*w||n
FreeLibrary|i|hLibModule:&HINSTANCE;||3
FreeLibraryAndExitThread|v|hLibModule:&HINSTANCE;,dwExitCode:m|n|3
FreeLibraryWhenCallbackReturns|v|pci:*@struct _TP_CALLBACK_INSTANCE;,mod:&HINSTANCE;||b
FreeResource|i|hResData:&HANDLE;||3
FreeUserPhysicalPages|i|hProcess:&HANDLE;,NumberOfPages:*r,PageArray:*r||8
GenerateConsoleCtrlEvent|i|ctrl_event:m,process_group_id:m||j
GetACP|u|||g
GetActiveProcessorCount|m|GroupNumber:t||1
GetActiveProcessorGroupCount|t|||1
GetAppContainerAce|i|Acl:*@ACL;,StartingAceIndex:m,AppContainerAce:**v,AppContainerAceIndex:*m||4
GetAppContainerNamedObjectPath|i|Token:&HANDLE;,AppContainerSid:*v,ObjectPathLength:m,ObjectPath:*w,ReturnLength:*m||q
GetApplicationRecoveryCallback|l|hProcess:&HANDLE;,pRecoveryCallback:*p,ppvParameter:**v,pdwPingInterval:*m,pdwFlags:*m||1
GetApplicationRestartSettings|l|hProcess:&HANDLE;,pwzCommandline:*w,pcchSize:*m,pdwFlags:*m||1
GetAtomNameA|u|nAtom:t,lpBuffer:*c,nSize:i||1
GetAtomNameW|u|nAtom:t,lpBuffer:*w,nSize:i||1
GetBinaryTypeA|i|lpApplicationName:^c,lpBinaryType:*m||1
GetBinaryTypeW|i|lpApplicationName:^w,lpBinaryType:*m||1
GetCPInfo|i|CodePage:u,lpCPInfo:*@struct _cpinfo;||g
GetCPInfoExA|i|CodePage:u,dwFlags:m,lpCPInfoEx:*@struct _cpinfoexA;||g
GetCPInfoExW|i|CodePage:u,dwFlags:m,lpCPInfoEx:*@struct _cpinfoexW;||g
GetCachedSigningLevel|i|File:&HANDLE;,Flags:*m,SigningLevel:*m,Thumbprint:*h,ThumbprintSize:*m,ThumbprintAlgorithm:*m||4
GetCalendarInfoA|i|Locale:m,Calendar:m,CalType:m,lpCalData:*c,cchData:i,lpValue:*m||g
GetCalendarInfoEx|i|lpLocaleName:^w,Calendar:m,lpReserved:^w,CalType:m,lpCalData:*w,cchData:i,lpValue:*m||g
GetCalendarInfoW|i|Locale:m,Calendar:m,CalType:m,lpCalData:*w,cchData:i,lpValue:*m||g
GetCommConfig|i|hCommDev:&HANDLE;,lpCC:*@struct _COMMCONFIG;,lpdwSize:*m||1
GetCommMask|i|hFile:&HANDLE;,lpEvtMask:*m||1
GetCommModemStatus|i|hFile:&HANDLE;,lpModemStat:*m||1
GetCommProperties|i|hFile:&HANDLE;,lpCommProp:*@struct _COMMPROP;||1
GetCommState|i|hFile:&HANDLE;,lpDCB:*@struct _DCB;||1
GetCommTimeouts|i|hFile:&HANDLE;,lpCommTimeouts:*@struct _COMMTIMEOUTS;||1
GetCommandLineA|*c|||n
GetCommandLineW|*w|||n
GetCompressedFileSizeA|m|lpFileName:^c,lpFileSizeHigh:*m||1
GetCompressedFileSizeTransactedA|m|lpFileName:^c,lpFileSizeHigh:*m,hTransaction:&HANDLE;||1
GetCompressedFileSizeTransactedW|m|lpFileName:^w,lpFileSizeHigh:*m,hTransaction:&HANDLE;||1
GetCompressedFileSizeW|m|lpFileName:^w,lpFileSizeHigh:*m||1
GetComputerNameA|i|lpBuffer:*c,nSize:*m||1
GetComputerNameExA|i|NameType:u,lpBuffer:*c,nSize:*m||m
GetComputerNameExW|i|NameType:u,lpBuffer:*w,nSize:*m||m
GetComputerNameW|i|lpBuffer:*w,nSize:*m||1
GetConsoleAliasA|m|source:*c,target_buffer:*c,target_buffer_length:m,exe_name:*c||2
GetConsoleAliasExesA|m|exe_name_buffer:*c,exe_name_buffer_length:m||2
GetConsoleAliasExesLengthA|m|||2
GetConsoleAliasExesLengthW|m|||2
GetConsoleAliasExesW|m|exe_name_buffer:*w,exe_name_buffer_length:m||2
GetConsoleAliasW|m|source:*w,target_buffer:*w,target_buffer_length:m,exe_name:*w||2
GetConsoleAliasesA|m|alias_buffer:*c,alias_buffer_length:m,exe_name:*c||2
GetConsoleAliasesLengthA|m|exe_name:*c||2
GetConsoleAliasesLengthW|m|exe_name:*w||2
GetConsoleAliasesW|m|alias_buffer:*w,alias_buffer_length:m,exe_name:*w||2
GetConsoleCP|u|||7
GetConsoleCommandHistoryA|m|commands:*c,command_buffer_length:m,exe_name:*c||2
GetConsoleCommandHistoryLengthA|m|exe_name:*c||2
GetConsoleCommandHistoryLengthW|m|exe_name:*w||2
GetConsoleCommandHistoryW|m|commands:*w,command_buffer_length:m,exe_name:*w||2
GetConsoleCursorInfo|i|console_output:&HANDLE;,console_cursor_info:*@struct _CONSOLE_CURSOR_INFO;||j
GetConsoleDisplayMode|i|mode_flags:*m||2
GetConsoleHistoryInfo|i|console_history_info:*@struct _CONSOLE_HISTORY_INFO;||2
GetConsoleMode|i|console_handle:&HANDLE;,mode:*m||7
GetConsoleOriginalTitleA|m|console_title:*c,size:m||j
GetConsoleOriginalTitleW|m|console_title:*w,size:m||j
GetConsoleOutputCP|u|||7
GetConsoleProcessList|m|process_list:*m,process_count:m||2
GetConsoleScreenBufferInfo|i|console_output:&HANDLE;,console_screen_buffer_info:*@struct _CONSOLE_SCREEN_BUFFER_INFO;||j
GetConsoleScreenBufferInfoEx|i|console_output:&HANDLE;,console_screen_buffer_info_ex:*@struct _CONSOLE_SCREEN_BUFFER_INFOEX;||j
GetConsoleSelectionInfo|i|console_selection_info:*@struct _CONSOLE_SELECTION_INFO;||2
GetConsoleTitleA|m|console_title:*c,size:m||j
GetConsoleTitleW|m|console_title:*w,size:m||j
GetConsoleWindow|&HWND;|||2
GetCurrencyFormatA|i|Locale:m,dwFlags:m,lpValue:^c,lpFormat:^@CURRENCYFMTA;,lpCurrencyStr:*c,cchCurrency:i||g
GetCurrencyFormatEx|i|lpLocaleName:^w,dwFlags:m,lpValue:^w,lpFormat:^@CURRENCYFMTW;,lpCurrencyStr:*w,cchCurrency:i||g
GetCurrencyFormatW|i|Locale:m,dwFlags:m,lpValue:^w,lpFormat:^@CURRENCYFMTW;,lpCurrencyStr:*w,cchCurrency:i||g
GetCurrentActCtx|i|lphActCtx:*&HANDLE;||1
GetCurrentConsoleFont|i|console_output:&HANDLE;,maximum_window:i,console_current_font:*@struct _CONSOLE_FONT_INFO;||2
GetCurrentConsoleFontEx|i|console_output:&HANDLE;,maximum_window:i,console_current_font_ex:*@struct _CONSOLE_FONT_INFOEX;||2
GetCurrentDirectoryA|m|nBufferLength:m,lpBuffer:*c||n
GetCurrentDirectoryW|m|nBufferLength:m,lpBuffer:*w||n
GetCurrentProcess|&HANDLE;|||k
GetCurrentProcessId|m|||k
GetCurrentProcessorNumber|m|||k
GetCurrentProcessorNumberEx|v|ProcNumber:*@struct _PROCESSOR_NUMBER;||k
GetCurrentThread|&HANDLE;|||k
GetCurrentThreadId|m|||k
GetCurrentThreadStackLimits|v|LowLimit:*r,HighLimit:*r||k
GetCurrentUmsThread|*v|||1
GetDateFormatA|i|Locale:m,dwFlags:m,lpDate:^@SYSTEMTIME;,lpFormat:^c,lpDateStr:*c,cchDate:i||r
GetDateFormatEx|i|lpLocaleName:^w,dwFlags:m,lpDate:^@SYSTEMTIME;,lpFormat:^w,lpDateStr:*w,cchDate:i,lpCalendar:^w||r
GetDateFormatW|i|Locale:m,dwFlags:m,lpDate:^@SYSTEMTIME;,lpFormat:^w,lpDateStr:*w,cchDate:i||r
GetDefaultCommConfigA|i|lpszName:^c,lpCC:*@struct _COMMCONFIG;,lpdwSize:*m||1
GetDefaultCommConfigW|i|lpszName:^w,lpCC:*@struct _COMMCONFIG;,lpdwSize:*m||1
GetDevicePowerState|i|hDevice:&HANDLE;,pfOn:*i||1
GetDiskFreeSpaceA|i|lpRootPathName:^c,lpSectorsPerCluster:*m,lpBytesPerSector:*m,lpNumberOfFreeClusters:*m,lpTotalNumberOfClusters:*m||9
GetDiskFreeSpaceExA|i|lpDirectoryName:^c,lpFreeBytesAvailableToCaller:*@ULARGE_INTEGER;,lpTotalNumberOfBytes:*@ULARGE_INTEGER;,lpTotalNumberOfFreeBytes:*@ULARGE_INTEGER;||9
GetDiskFreeSpaceExW|i|lpDirectoryName:^w,lpFreeBytesAvailableToCaller:*@ULARGE_INTEGER;,lpTotalNumberOfBytes:*@ULARGE_INTEGER;,lpTotalNumberOfFreeBytes:*@ULARGE_INTEGER;||9
GetDiskFreeSpaceW|i|lpRootPathName:^w,lpSectorsPerCluster:*m,lpBytesPerSector:*m,lpNumberOfFreeClusters:*m,lpTotalNumberOfClusters:*m||9
GetDiskSpaceInformationA|l|rootPath:^c,diskSpaceInfo:*@DISK_SPACE_INFORMATION;||9
GetDiskSpaceInformationW|l|rootPath:^w,diskSpaceInfo:*@DISK_SPACE_INFORMATION;||9
GetDllDirectoryA|m|nBufferLength:m,lpBuffer:*c||1
GetDllDirectoryW|m|nBufferLength:m,lpBuffer:*w||1
GetDriveTypeA|u|lpRootPathName:^c||9
GetDriveTypeW|u|lpRootPathName:^w||9
GetDurationFormat|i|Locale:m,dwFlags:m,lpDuration:^@SYSTEMTIME;,ullDuration:r,lpFormat:^w,lpDurationStr:*w,cchDuration:i||g
GetDurationFormatEx|i|lpLocaleName:^w,dwFlags:m,lpDuration:^@SYSTEMTIME;,ullDuration:r,lpFormat:^w,lpDurationStr:*w,cchDuration:i||g
GetDynamicTimeZoneInformation|m|pTimeZoneInformation:*@struct _TIME_DYNAMIC_ZONE_INFORMATION;||o
GetEnabledXStateFeatures|r|||1
GetEnvironmentStrings|*c|||n
GetEnvironmentStringsW|*w|||n
GetEnvironmentVariableA|m|lpName:^c,lpBuffer:*c,nSize:m||n
GetEnvironmentVariableW|m|lpName:^w,lpBuffer:*w,nSize:m||n
GetErrorMode|u|||6
GetExitCodeProcess|i|hProcess:&HANDLE;,lpExitCode:*m||k
GetExitCodeThread|i|hThread:&HANDLE;,lpExitCode:*m||k
GetFileAttributesA|m|lpFileName:^c||9
GetFileAttributesExA|i|lpFileName:^c,fInfoLevelId:u,lpFileInformation:*v||9
GetFileAttributesExW|i|lpFileName:^w,fInfoLevelId:u,lpFileInformation:*v||9
GetFileAttributesTransactedA|i|lpFileName:^c,fInfoLevelId:u,lpFileInformation:*v,hTransaction:&HANDLE;||1
GetFileAttributesTransactedW|i|lpFileName:^w,fInfoLevelId:u,lpFileInformation:*v,hTransaction:&HANDLE;||1
GetFileAttributesW|m|lpFileName:^w||9
GetFileBandwidthReservation|i|hFile:&HANDLE;,lpPeriodMilliseconds:*m,lpBytesPerPeriod:*m,pDiscardable:*i,lpTransferSize:*m,lpNumOutstandingRequests:*m||1
GetFileInformationByHandle|i|hFile:&HANDLE;,lpFileInformation:*@struct _BY_HANDLE_FILE_INFORMATION;||9
GetFileInformationByHandleEx|i|hFile:&HANDLE;,FileInformationClass:u,lpFileInformation:*v,dwBufferSize:m||1
GetFileInformationByName|i|FileName:^w,FileInformationClass:u,FileInfoBuffer:*v,FileInfoBufferSize:m||1
GetFileMUIInfo|i|dwFlags:m,pcwszFilePath:^w,pFileMUIInfo:*@struct _FILEMUIINFO;,pcbFileMUIInfo:*m||g
GetFileMUIPath|i|dwFlags:m,pcwszFilePath:^w,pwszLanguage:*w,pcchLanguage:*m,pwszFileMUIPath:*w,pcchFileMUIPath:*m,pululEnumerator:*r||g
GetFileSize|m|hFile:&HANDLE;,lpFileSizeHigh:*m||9
GetFileSizeEx|i|hFile:&HANDLE;,lpFileSize:*@LARGE_INTEGER;||9
GetFileTime|i|hFile:&HANDLE;,lpCreationTime:*@struct _FILETIME;,lpLastAccessTime:*@struct _FILETIME;,lpLastWriteTime:*@struct _FILETIME;||9
GetFileType|m|hFile:&HANDLE;||9
GetFinalPathNameByHandleA|m|hFile:&HANDLE;,lpszFilePath:*c,cchFilePath:m,dwFlags:m||9
GetFinalPathNameByHandleW|m|hFile:&HANDLE;,lpszFilePath:*w,cchFilePath:m,dwFlags:m||9
GetFirmwareEnvironmentVariableA|m|lpName:^c,lpGuid:^c,pBuffer:*v,nSize:m||1
GetFirmwareEnvironmentVariableExA|m|lpName:^c,lpGuid:^c,pBuffer:*v,nSize:m,pdwAttribubutes:*m||1
GetFirmwareEnvironmentVariableExW|m|lpName:^w,lpGuid:^w,pBuffer:*v,nSize:m,pdwAttribubutes:*m||1
GetFirmwareEnvironmentVariableW|m|lpName:^w,lpGuid:^w,pBuffer:*v,nSize:m||1
GetFullPathNameA|m|lpFileName:^c,nBufferLength:m,lpBuffer:*c,lpFilePart:**c||9
GetFullPathNameTransactedA|m|lpFileName:^c,nBufferLength:m,lpBuffer:*c,lpFilePart:**c,hTransaction:&HANDLE;||1
GetFullPathNameTransactedW|m|lpFileName:^w,nBufferLength:m,lpBuffer:*w,lpFilePart:**w,hTransaction:&HANDLE;||1
GetFullPathNameW|m|lpFileName:^w,nBufferLength:m,lpBuffer:*w,lpFilePart:**w||9
GetGeoInfoA|i|Location:l,GeoType:m,lpGeoData:*c,cchData:i,LangId:t||g
GetGeoInfoEx|i|location:*w,geoType:m,geoData:*w,geoDataCount:i||g
GetGeoInfoW|i|Location:l,GeoType:m,lpGeoData:*w,cchData:i,LangId:t||g
GetHandleInformation|i|hObject:&HANDLE;,lpdwFlags:*m||f
GetLargePageMinimum|z|||8
GetLastError|m|||6
GetLocalTime|v|lpSystemTime:*@struct _SYSTEMTIME;||m
GetLocaleInfoA|i|Locale:m,LCType:m,lpLCData:*c,cchData:i||g
GetLocaleInfoEx|i|lpLocaleName:^w,LCType:m,lpLCData:*w,cchData:i||g
GetLocaleInfoW|i|Locale:m,LCType:m,lpLCData:*w,cchData:i||g
GetLogicalDriveStringsA|m|nBufferLength:m,lpBuffer:*c||1
GetLogicalDriveStringsW|m|nBufferLength:m,lpBuffer:*w||9
GetLogicalDrives|m|||9
GetLogicalProcessorInformation|i|Buffer:*@struct _SYSTEM_LOGICAL_PROCESSOR_INFORMATION;,ReturnedLength:*m||m
GetLogicalProcessorInformationEx|i|RelationshipType:u,Buffer:*@struct _SYSTEM_LOGICAL_PROCESSOR_INFORMATION_EX;,ReturnedLength:*m||m
GetLongPathNameA|m|lpszShortPath:^c,lpszLongPath:*c,cchBuffer:m||9
GetLongPathNameTransactedA|m|lpszShortPath:^c,lpszLongPath:*c,cchBuffer:m,hTransaction:&HANDLE;||1
GetLongPathNameTransactedW|m|lpszShortPath:^w,lpszLongPath:*w,cchBuffer:m,hTransaction:&HANDLE;||1
GetLongPathNameW|m|lpszShortPath:^w,lpszLongPath:*w,cchBuffer:m||9
GetMachineTypeAttributes|l|Machine:t,MachineTypeAttributes:*u||k
GetMailslotInfo|i|hMailslot:&HANDLE;,lpMaxMessageSize:*m,lpNextSize:*m,lpMessageCount:*m,lpReadTimeout:*m||1
GetMaximumProcessorCount|m|GroupNumber:t||1
GetMaximumProcessorGroupCount|t|||1
GetMemoryErrorHandlingCapabilities|i|Capabilities:*m||8
GetModuleFileNameA|m|hModule:&HINSTANCE;,lpFilename:*c,nSize:m||3
GetModuleFileNameW|m|hModule:&HINSTANCE;,lpFilename:*w,nSize:m||3
GetModuleHandleA|&HINSTANCE;|lpModuleName:^c||3
GetModuleHandleExA|i|dwFlags:m,lpModuleName:^c,phModule:*&HINSTANCE;||3
GetModuleHandleExW|i|dwFlags:m,lpModuleName:^w,phModule:*&HINSTANCE;||3
GetModuleHandleW|&HINSTANCE;|lpModuleName:^w||3
GetNLSVersion|i|Function:m,Locale:m,lpVersionInformation:*@struct _nlsversioninfo;||g
GetNLSVersionEx|i|function:m,lpLocaleName:^w,lpVersionInformation:*@struct _nlsversioninfoex;||g
GetNamedPipeClientComputerNameA|i|Pipe:&HANDLE;,ClientComputerName:*c,ClientComputerNameLength:m||1
GetNamedPipeClientComputerNameW|i|Pipe:&HANDLE;,ClientComputerName:*w,ClientComputerNameLength:m||i
GetNamedPipeClientProcessId|i|Pipe:&HANDLE;,ClientProcessId:*m||1
GetNamedPipeClientSessionId|i|Pipe:&HANDLE;,ClientSessionId:*m||1
GetNamedPipeHandleStateA|i|hNamedPipe:&HANDLE;,lpState:*m,lpCurInstances:*m,lpMaxCollectionCount:*m,lpCollectDataTimeout:*m,lpUserName:*c,nMaxUserNameSize:m||1
GetNamedPipeHandleStateW|i|hNamedPipe:&HANDLE;,lpState:*m,lpCurInstances:*m,lpMaxCollectionCount:*m,lpCollectDataTimeout:*m,lpUserName:*w,nMaxUserNameSize:m||1
GetNamedPipeInfo|i|hNamedPipe:&HANDLE;,lpFlags:*m,lpOutBufferSize:*m,lpInBufferSize:*m,lpMaxInstances:*m||1
GetNamedPipeServerProcessId|i|Pipe:&HANDLE;,ServerProcessId:*m||1
GetNamedPipeServerSessionId|i|Pipe:&HANDLE;,ServerSessionId:*m||1
GetNativeSystemInfo|v|lpSystemInfo:*@struct _SYSTEM_INFO;||m
GetNextUmsListItem|*v|UmsContext:*v||1
GetNumaAvailableMemoryNode|i|Node:h,AvailableBytes:*r||1
GetNumaAvailableMemoryNodeEx|i|Node:t,AvailableBytes:*r||1
GetNumaHighestNodeNumber|i|HighestNodeNumber:*m||s
GetNumaNodeNumberFromHandle|i|hFile:&HANDLE;,NodeNumber:*t||1
GetNumaNodeProcessorMask|i|Node:h,ProcessorMask:*r||1
GetNumaNodeProcessorMaskEx|i|Node:t,ProcessorMask:*@struct _GROUP_AFFINITY;||s
GetNumaProcessorNode|i|Processor:h,NodeNumber:*h||1
GetNumaProcessorNodeEx|i|Processor:*@struct _PROCESSOR_NUMBER;,NodeNumber:*t||1
GetNumaProximityNode|i|ProximityId:m,NodeNumber:*h||1
GetNumaProximityNodeEx|i|ProximityId:m,NodeNumber:*t||1
GetNumberFormatA|i|Locale:m,dwFlags:m,lpValue:^c,lpFormat:^@NUMBERFMTA;,lpNumberStr:*c,cchNumber:i||g
GetNumberFormatEx|i|lpLocaleName:^w,dwFlags:m,lpValue:^w,lpFormat:^@NUMBERFMTW;,lpNumberStr:*w,cchNumber:i||g
GetNumberFormatW|i|Locale:m,dwFlags:m,lpValue:^w,lpFormat:^@NUMBERFMTW;,lpNumberStr:*w,cchNumber:i||g
GetNumberOfConsoleInputEvents|i|console_input:&HANDLE;,number_of_events:*m||7
GetNumberOfConsoleMouseButtons|i|number_of_mouse_buttons:*m||2
GetOEMCP|u|||g
GetOverlappedResult|i|hFile:&HANDLE;,lpOverlapped:*@struct _OVERLAPPED;,lpNumberOfBytesTransferred:*m,bWait:i||c
GetOverlappedResultEx|i|hFile:&HANDLE;,lpOverlapped:*@struct _OVERLAPPED;,lpNumberOfBytesTransferred:*m,dwMilliseconds:m,bAlertable:i||c
GetPhysicallyInstalledSystemMemory|i|TotalMemoryInKilobytes:*r||1
GetPriorityClass|m|hProcess:&HANDLE;||k
GetPrivateProfileIntA|u|lpAppName:^c,lpKeyName:^c,nDefault:i,lpFileName:^c||1
GetPrivateProfileIntW|u|lpAppName:^w,lpKeyName:^w,nDefault:i,lpFileName:^w||1
GetPrivateProfileSectionA|m|lpAppName:^c,lpReturnedString:*c,nSize:m,lpFileName:^c||1
GetPrivateProfileSectionNamesA|m|lpszReturnBuffer:*c,nSize:m,lpFileName:^c||1
GetPrivateProfileSectionNamesW|m|lpszReturnBuffer:*w,nSize:m,lpFileName:^w||1
GetPrivateProfileSectionW|m|lpAppName:^w,lpReturnedString:*w,nSize:m,lpFileName:^w||1
GetPrivateProfileStringA|m|lpAppName:^c,lpKeyName:^c,lpDefault:^c,lpReturnedString:*c,nSize:m,lpFileName:^c||1
GetPrivateProfileStringW|m|lpAppName:^w,lpKeyName:^w,lpDefault:^w,lpReturnedString:*w,nSize:m,lpFileName:^w||1
GetPrivateProfileStructA|i|lpszSection:^c,lpszKey:^c,lpStruct:*v,uSizeStruct:u,szFile:^c||1
GetPrivateProfileStructW|i|lpszSection:^w,lpszKey:^w,lpStruct:*v,uSizeStruct:u,szFile:^w||1
GetProcAddress|p|hModule:&HINSTANCE;,lpProcName:^c||3
GetProcessAffinityMask|i|hProcess:&HANDLE;,lpProcessAffinityMask:*r,lpSystemAffinityMask:*r||1
GetProcessDEPPolicy|i|hProcess:&HANDLE;,lpFlags:*m,lpPermanent:*i||1
GetProcessDefaultCpuSetMasks|i|Process:&HANDLE;,CpuSetMasks:*@struct _GROUP_AFFINITY;,CpuSetMaskCount:t,RequiredMaskCount:*t||k
GetProcessDefaultCpuSets|i|Process:&HANDLE;,CpuSetIds:*m,CpuSetIdCount:m,RequiredIdCount:*m||k
GetProcessGroupAffinity|i|hProcess:&HANDLE;,GroupCount:*t,GroupArray:*t||t
GetProcessHandleCount|i|hProcess:&HANDLE;,pdwHandleCount:*m||k
GetProcessHeap|&HANDLE;|||u
GetProcessHeaps|m|NumberOfHeaps:m,ProcessHeaps:*&HANDLE;||u
GetProcessId|m|Process:&HANDLE;||k
GetProcessIdOfThread|m|Thread:&HANDLE;||k
GetProcessInformation|i|hProcess:&HANDLE;,ProcessInformationClass:u,ProcessInformation:*v,ProcessInformationSize:m||k
GetProcessIoCounters|i|hProcess:&HANDLE;,lpIoCounters:*@IO_COUNTERS;||1
GetProcessMitigationPolicy|i|hProcess:&HANDLE;,MitigationPolicy:u,lpBuffer:*v,dwLength:z||k
GetProcessPreferredUILanguages|i|dwFlags:m,pulNumLanguages:*m,pwszLanguagesBuffer:*w,pcchLanguagesBuffer:*m||g
GetProcessPriorityBoost|i|hProcess:&HANDLE;,pDisablePriorityBoost:*i||1
GetProcessShutdownParameters|i|lpdwLevel:*m,lpdwFlags:*m||1
GetProcessTimes|i|hProcess:&HANDLE;,lpCreationTime:*@struct _FILETIME;,lpExitTime:*@struct _FILETIME;,lpKernelTime:*@struct _FILETIME;,lpUserTime:*@struct _FILETIME;||k
GetProcessVersion|m|ProcessId:m||k
GetProcessWorkingSetSize|i|hProcess:&HANDLE;,lpMinimumWorkingSetSize:*r,lpMaximumWorkingSetSize:*r||1
GetProcessWorkingSetSizeEx|i|hProcess:&HANDLE;,lpMinimumWorkingSetSize:*r,lpMaximumWorkingSetSize:*r,Flags:*m||8
GetProcessorSystemCycleTime|i|Group:t,Buffer:*@struct _SYSTEM_PROCESSOR_CYCLE_TIME_INFORMATION;,ReturnedLength:*m||1
GetProductInfo|i|dwOSMajorVersion:m,dwOSMinorVersion:m,dwSpMajorVersion:m,dwSpMinorVersion:m,pdwReturnedProductType:*m||m
GetProfileIntA|u|lpAppName:^c,lpKeyName:^c,nDefault:i||1
GetProfileIntW|u|lpAppName:^w,lpKeyName:^w,nDefault:i||1
GetProfileSectionA|m|lpAppName:^c,lpReturnedString:*c,nSize:m||1
GetProfileSectionW|m|lpAppName:^w,lpReturnedString:*w,nSize:m||1
GetProfileStringA|m|lpAppName:^c,lpKeyName:^c,lpDefault:^c,lpReturnedString:*c,nSize:m||1
GetProfileStringW|m|lpAppName:^w,lpKeyName:^w,lpDefault:^w,lpReturnedString:*w,nSize:m||1
GetQueuedCompletionStatus|i|CompletionPort:&HANDLE;,lpNumberOfBytesTransferred:*m,lpCompletionKey:*r,lpOverlapped:**@struct _OVERLAPPED;,dwMilliseconds:m||c
GetQueuedCompletionStatusEx|i|CompletionPort:&HANDLE;,lpCompletionPortEntries:*@struct _OVERLAPPED_ENTRY;,ulCount:m,ulNumEntriesRemoved:*m,dwMilliseconds:m,fAlertable:i||c
GetShortPathNameA|m|lpszLongPath:^c,lpszShortPath:*c,cchBuffer:m||1
GetShortPathNameW|m|lpszLongPath:^w,lpszShortPath:*w,cchBuffer:m||9
GetStartupInfoA|v|lpStartupInfo:*@struct _STARTUPINFOA;||1
GetStartupInfoW|v|lpStartupInfo:*@struct _STARTUPINFOW;||k
GetStdHandle|&HANDLE;|nStdHandle:m||n
GetStringScripts|i|dwFlags:m,lpString:^w,cchString:i,lpScripts:*w,cchScripts:i||g
GetStringTypeA|i|Locale:m,dwInfoType:m,lpSrcStr:^c,cchSrc:i,lpCharType:*t||g
GetStringTypeExA|i|Locale:m,dwInfoType:m,lpSrcStr:^c,cchSrc:i,lpCharType:*t||g
GetStringTypeExW|i|Locale:m,dwInfoType:m,lpSrcStr:^w,cchSrc:i,lpCharType:*t||h
GetStringTypeW|i|dwInfoType:m,lpSrcStr:^w,cchSrc:i,lpCharType:*t||h
GetSystemCpuSetInformation|i|Information:*@struct _SYSTEM_CPU_SET_INFORMATION;,BufferLength:m,ReturnedLength:*m,Process:&HANDLE;,Flags:m||k
GetSystemDEPPolicy|u|||1
GetSystemDefaultLCID|m|||g
GetSystemDefaultLangID|t|||g
GetSystemDefaultLocaleName|i|lpLocaleName:*w,cchLocaleName:i||g
GetSystemDefaultUILanguage|t|||g
GetSystemDirectoryA|u|lpBuffer:*c,uSize:u||m
GetSystemDirectoryW|u|lpBuffer:*w,uSize:u||m
GetSystemFileCacheSize|i|lpMinimumFileCacheSize:*r,lpMaximumFileCacheSize:*r,lpFlags:*m||8
GetSystemFirmwareTable|u|FirmwareTableProviderSignature:m,FirmwareTableID:m,pFirmwareTableBuffer:*v,BufferSize:m||m
GetSystemInfo|v|lpSystemInfo:*@struct _SYSTEM_INFO;||m
GetSystemPowerStatus|i|lpSystemPowerStatus:*@struct _SYSTEM_POWER_STATUS;||1
GetSystemPreferredUILanguages|i|dwFlags:m,pulNumLanguages:*m,pwszLanguagesBuffer:*w,pcchLanguagesBuffer:*m||g
GetSystemRegistryQuota|i|pdwQuotaAllowed:*m,pdwQuotaUsed:*m||1
GetSystemTime|v|lpSystemTime:*@struct _SYSTEMTIME;||m
GetSystemTimeAdjustment|i|lpTimeAdjustment:*m,lpTimeIncrement:*m,lpTimeAdjustmentDisabled:*i||m
GetSystemTimeAsFileTime|v|lpSystemTimeAsFileTime:*@struct _FILETIME;||m
GetSystemTimePreciseAsFileTime|v|lpSystemTimeAsFileTime:*@struct _FILETIME;||m
GetSystemTimes|i|lpIdleTime:*@struct _FILETIME;,lpKernelTime:*@struct _FILETIME;,lpUserTime:*@struct _FILETIME;||1
GetSystemWindowsDirectoryA|u|lpBuffer:*c,uSize:u||m
GetSystemWindowsDirectoryW|u|lpBuffer:*w,uSize:u||m
GetSystemWow64DirectoryA|u|lpBuffer:*c,uSize:u||v
GetSystemWow64DirectoryW|u|lpBuffer:*w,uSize:u||v
GetTapeParameters|m|hDevice:&HANDLE;,dwOperation:m,lpdwSize:*m,lpTapeInformation:*v||1
GetTapePosition|m|hDevice:&HANDLE;,dwPositionType:m,lpdwPartition:*m,lpdwOffsetLow:*m,lpdwOffsetHigh:*m||1
GetTapeStatus|m|hDevice:&HANDLE;||1
GetTempFileNameA|u|lpPathName:^c,lpPrefixString:^c,uUnique:u,lpTempFileName:*c||9
GetTempFileNameW|u|lpPathName:^w,lpPrefixString:^w,uUnique:u,lpTempFileName:*w||9
GetTempPath2A|m|BufferLength:m,Buffer:*c||9
GetTempPath2W|m|BufferLength:m,Buffer:*w||9
GetTempPathA|m|nBufferLength:m,lpBuffer:*c||9
GetTempPathW|m|nBufferLength:m,lpBuffer:*w||9
GetThreadContext|i|hThread:&HANDLE;,lpContext:*@struct _CONTEXT;||k
GetThreadDescription|l|hThread:&HANDLE;,ppszThreadDescription:**w||k
GetThreadEnabledXStateFeatures|r|||1
GetThreadErrorMode|m|||1
GetThreadGroupAffinity|i|hThread:&HANDLE;,GroupAffinity:*@struct _GROUP_AFFINITY;||t
GetThreadIOPendingFlag|i|hThread:&HANDLE;,lpIOIsPending:*i||1
GetThreadId|m|Thread:&HANDLE;||k
GetThreadIdealProcessorEx|i|hThread:&HANDLE;,lpIdealProcessor:*@struct _PROCESSOR_NUMBER;||k
GetThreadInformation|i|hThread:&HANDLE;,ThreadInformationClass:u,ThreadInformation:*v,ThreadInformationSize:m||1
GetThreadLocale|m|||g
GetThreadPreferredUILanguages|i|dwFlags:m,pulNumLanguages:*m,pwszLanguagesBuffer:*w,pcchLanguagesBuffer:*m||g
GetThreadPriority|i|hThread:&HANDLE;||k
GetThreadPriorityBoost|i|hThread:&HANDLE;,pDisablePriorityBoost:*i||k
GetThreadSelectedCpuSetMasks|i|Thread:&HANDLE;,CpuSetMasks:*@struct _GROUP_AFFINITY;,CpuSetMaskCount:t,RequiredMaskCount:*t||k
GetThreadSelectedCpuSets|i|Thread:&HANDLE;,CpuSetIds:*m,CpuSetIdCount:m,RequiredIdCount:*m||k
GetThreadSelectorEntry|i|hThread:&HANDLE;,dwSelector:m,lpSelectorEntry:*v||1
GetThreadTimes|i|hThread:&HANDLE;,lpCreationTime:*@struct _FILETIME;,lpExitTime:*@struct _FILETIME;,lpKernelTime:*@struct _FILETIME;,lpUserTime:*@struct _FILETIME;||k
GetThreadUILanguage|t|||g
GetTickCount|m|||m
GetTickCount64|r|||m
GetTimeFormatA|i|Locale:m,dwFlags:m,lpTime:^@SYSTEMTIME;,lpFormat:^c,lpTimeStr:*c,cchTime:i||r
GetTimeFormatEx|i|lpLocaleName:^w,dwFlags:m,lpTime:^@SYSTEMTIME;,lpFormat:^w,lpTimeStr:*w,cchTime:i||r
GetTimeFormatW|i|Locale:m,dwFlags:m,lpTime:^@SYSTEMTIME;,lpFormat:^w,lpTimeStr:*w,cchTime:i||r
GetTimeZoneInformation|m|lpTimeZoneInformation:*@struct _TIME_ZONE_INFORMATION;||o
GetTimeZoneInformationForYear|i|wYear:t,pdtzi:*@struct _TIME_DYNAMIC_ZONE_INFORMATION;,ptzi:*@struct _TIME_ZONE_INFORMATION;||o
GetUILanguageInfo|i|dwFlags:m,pwmszLanguage:^w,pwszFallbackLanguages:*w,pcchFallbackLanguages:*m,pAttributes:*m||g
GetUmsCompletionListEvent|i|UmsCompletionList:*v,UmsCompletionEvent:*&HANDLE;||1
GetUmsSystemThreadInformation|i|ThreadHandle:&HANDLE;,SystemThreadInfo:*@struct _UMS_SYSTEM_THREAD_INFORMATION;||1
GetUserDefaultGeoName|i|geoName:*w,geoNameCount:i||g
GetUserDefaultLCID|m|||g
GetUserDefaultLangID|t|||g
GetUserDefaultLocaleName|i|lpLocaleName:*w,cchLocaleName:i||g
GetUserDefaultUILanguage|t|||g
GetUserGeoID|l|GeoClass:m||g
GetUserPreferredUILanguages|i|dwFlags:m,pulNumLanguages:*m,pwszLanguagesBuffer:*w,pcchLanguagesBuffer:*m||g
GetVersion|m|||m
GetVersionExA|i|lpVersionInformation:*@struct _OSVERSIONINFOA;||m
GetVersionExW|i|lpVersionInformation:*@struct _OSVERSIONINFOW;||m
GetVolumeInformationA|i|lpRootPathName:^c,lpVolumeNameBuffer:*c,nVolumeNameSize:m,lpVolumeSerialNumber:*m,lpMaximumComponentLength:*m,lpFileSystemFlags:*m,lpFileSystemNameBuffer:*c,nFileSystemNameSize:m||1
GetVolumeInformationByHandleW|i|hFile:&HANDLE;,lpVolumeNameBuffer:*w,nVolumeNameSize:m,lpVolumeSerialNumber:*m,lpMaximumComponentLength:*m,lpFileSystemFlags:*m,lpFileSystemNameBuffer:*w,nFileSystemNameSize:m||9
GetVolumeInformationW|i|lpRootPathName:^w,lpVolumeNameBuffer:*w,nVolumeNameSize:m,lpVolumeSerialNumber:*m,lpMaximumComponentLength:*m,lpFileSystemFlags:*m,lpFileSystemNameBuffer:*w,nFileSystemNameSize:m||9
GetVolumeNameForVolumeMountPointA|i|lpszVolumeMountPoint:^c,lpszVolumeName:*c,cchBufferLength:m||1
GetVolumeNameForVolumeMountPointW|i|lpszVolumeMountPoint:^w,lpszVolumeName:*w,cchBufferLength:m||9
GetVolumePathNameA|i|lpszFileName:^c,lpszVolumePathName:*c,cchBufferLength:m||1
GetVolumePathNameW|i|lpszFileName:^w,lpszVolumePathName:*w,cchBufferLength:m||9
GetVolumePathNamesForVolumeNameA|i|lpszVolumeName:^c,lpszVolumePathNames:*c,cchBufferLength:m,lpcchReturnLength:*m||1
GetVolumePathNamesForVolumeNameW|i|lpszVolumeName:^w,lpszVolumePathNames:*w,cchBufferLength:m,lpcchReturnLength:*m||9
GetWindowsDirectoryA|u|lpBuffer:*c,uSize:u||m
GetWindowsDirectoryW|u|lpBuffer:*w,uSize:u||m
GetWriteWatch|u|dwFlags:m,lpBaseAddress:*v,dwRegionSize:z,lpAddresses:**v,lpdwCount:*r,lpdwGranularity:*m||8
GetXStateFeaturesMask|i|Context:*@struct _CONTEXT;,FeatureMask:*r||1
GlobalAddAtomA|t|lpString:^c||1
GlobalAddAtomExA|t|lpString:^c,Flags:m||1
GlobalAddAtomExW|t|lpString:^w,Flags:m||1
GlobalAddAtomW|t|lpString:^w||1
GlobalAlloc|&HANDLE;|uFlags:u,dwBytes:z||1
GlobalCompact|z|dwMinFree:m||1
GlobalDeleteAtom|t|nAtom:t||1
GlobalFindAtomA|t|lpString:^c||1
GlobalFindAtomW|t|lpString:^w||1
GlobalFix|v|hMem:&HANDLE;||1
GlobalFlags|u|hMem:&HANDLE;||1
GlobalFree|&HANDLE;|hMem:&HANDLE;||1
GlobalGetAtomNameA|u|nAtom:t,lpBuffer:*c,nSize:i||1
GlobalGetAtomNameW|u|nAtom:t,lpBuffer:*w,nSize:i||1
GlobalHandle|&HANDLE;|pMem:^v||1
GlobalLock|*v|hMem:&HANDLE;||1
GlobalMemoryStatus|v|lpBuffer:*@struct _MEMORYSTATUS;||1
GlobalMemoryStatusEx|i|lpBuffer:*@struct _MEMORYSTATUSEX;||m
GlobalReAlloc|&HANDLE;|hMem:&HANDLE;,dwBytes:z,uFlags:u||1
GlobalSize|z|hMem:&HANDLE;||1
GlobalUnWire|i|hMem:&HANDLE;||1
GlobalUnfix|v|hMem:&HANDLE;||1
GlobalUnlock|i|hMem:&HANDLE;||1
GlobalWire|*v|hMem:&HANDLE;||1
Heap32First|i|lphe:*@HEAPENTRY32;,th32ProcessID:m,th32HeapID:r||l
Heap32ListFirst|i|hSnapshot:&HANDLE;,lphl:*@HEAPLIST32;||l
Heap32ListNext|i|hSnapshot:&HANDLE;,lphl:*@HEAPLIST32;||l
Heap32Next|i|lphe:*@HEAPENTRY32;||l
HeapAlloc|*v|hHeap:&HANDLE;,dwFlags:m,dwBytes:z||u
HeapCompact|z|hHeap:&HANDLE;,dwFlags:m||u
HeapCreate|&HANDLE;|flOptions:m,dwInitialSize:z,dwMaximumSize:z||u
HeapDestroy|i|hHeap:&HANDLE;||u
HeapFree|i|hHeap:&HANDLE;,dwFlags:m,lpMem:*v||u
HeapLock|i|hHeap:&HANDLE;||u
HeapQueryInformation|i|HeapHandle:&HANDLE;,HeapInformationClass:u,HeapInformation:*v,HeapInformationLength:z,ReturnLength:*r||u
HeapReAlloc|*v|hHeap:&HANDLE;,dwFlags:m,lpMem:*v,dwBytes:z||u
HeapSetInformation|i|HeapHandle:&HANDLE;,HeapInformationClass:u,HeapInformation:*v,HeapInformationLength:z||u
HeapSize|z|hHeap:&HANDLE;,dwFlags:m,lpMem:^v||u
HeapSummary|i|hHeap:&HANDLE;,dwFlags:m,lpSummary:*@struct _HEAP_SUMMARY;||u
HeapUnlock|i|hHeap:&HANDLE;||u
HeapValidate|i|hHeap:&HANDLE;,dwFlags:m,lpMem:^v||u
HeapWalk|i|hHeap:&HANDLE;,lpEntry:*@struct _PROCESS_HEAP_ENTRY;||u
IdnToAscii|i|dwFlags:m,lpUnicodeCharStr:^w,cchUnicodeChar:i,lpASCIICharStr:*w,cchASCIIChar:i||g
IdnToNameprepUnicode|i|dwFlags:m,lpUnicodeCharStr:^w,cchUnicodeChar:i,lpNameprepCharStr:*w,cchNameprepChar:i||g
IdnToUnicode|i|dwFlags:m,lpASCIICharStr:^w,cchASCIIChar:i,lpUnicodeCharStr:*w,cchUnicodeChar:i||g
InitAtomTable|i|nSize:m||1
InitOnceBeginInitialize|i|lpInitOnce:*@struct _RTL_RUN_ONCE;,dwFlags:m,fPending:*i,lpContext:**v||0
InitOnceComplete|i|lpInitOnce:*@struct _RTL_RUN_ONCE;,dwFlags:m,lpContext:*v||0
InitOnceExecuteOnce|i|InitOnce:*@struct _RTL_RUN_ONCE;,InitFn:p,Parameter:*v,Context:**v||0
InitOnceInitialize|v|InitOnce:*@struct _RTL_RUN_ONCE;||0
InitializeConditionVariable|v|ConditionVariable:*@RTL_CONDITION_VARIABLE;||0
InitializeContext|i|Buffer:*v,ContextFlags:m,Context:**@struct _CONTEXT;,ContextLength:*m||1
InitializeContext2|i|Buffer:*v,ContextFlags:m,Context:**@struct _CONTEXT;,ContextLength:*m,XStateCompactionMask:r||1
InitializeCriticalSection|v|lpCriticalSection:*@struct _RTL_CRITICAL_SECTION;||0
InitializeCriticalSectionAndSpinCount|i|lpCriticalSection:*@struct _RTL_CRITICAL_SECTION;,dwSpinCount:m||0
InitializeCriticalSectionEx|i|lpCriticalSection:*@struct _RTL_CRITICAL_SECTION;,dwSpinCount:m,Flags:m||0
InitializeProcThreadAttributeList|i|lpAttributeList:*@struct _PROC_THREAD_ATTRIBUTE_LIST;,dwAttributeCount:m,dwFlags:m,lpSize:*r||k
InitializeSListHead|v|ListHead:*@union _SLIST_HEADER;||w
InitializeSRWLock|v|SRWLock:*@RTL_SRWLOCK;||0
InitializeSynchronizationBarrier|i|lpBarrier:*@struct _RTL_BARRIER;,lTotalThreads:l,lSpinCount:l||0
InterlockedBitTestAndComplement|h|a:*l,b:l||x
InterlockedBitTestAndComplement64|h|a:*q,b:q||x
InterlockedBitTestAndReset|h|a:*l,b:l||x
InterlockedBitTestAndReset64|h|a:*q,b:q||x
InterlockedBitTestAndSet|h|a:*l,b:l||x
InterlockedBitTestAndSet64|h|a:*q,b:q||x
InterlockedFlushSList|*@struct _SLIST_ENTRY;|ListHead:*@union _SLIST_HEADER;||w
InterlockedPopEntrySList|*@struct _SLIST_ENTRY;|ListHead:*@union _SLIST_HEADER;||w
InterlockedPushEntrySList|*@struct _SLIST_ENTRY;|ListHead:*@union _SLIST_HEADER;,ListEntry:*@struct _SLIST_ENTRY;||w
InterlockedPushListSListEx|*@struct _SLIST_ENTRY;|ListHead:*@union _SLIST_HEADER;,List:*@struct _SLIST_ENTRY;,ListEnd:*@struct _SLIST_ENTRY;,Count:m||w
IsBadCodePtr|i|lpfn:p||1
IsBadHugeReadPtr|i|lp:^v,ucb:r||1
IsBadHugeWritePtr|i|lp:*v,ucb:r||1
IsBadReadPtr|i|lp:^v,ucb:r||1
IsBadStringPtrA|i|lpsz:^c,ucchMax:r||1
IsBadStringPtrW|i|lpsz:^w,ucchMax:r||1
IsBadWritePtr|i|lp:*v,ucb:r||1
IsDBCSLeadByte|i|TestChar:h||g
IsDBCSLeadByteEx|i|CodePage:u,TestChar:h||g
IsDebuggerPresent|i|||e
IsNLSDefinedString|i|Function:m,dwFlags:m,lpVersionInformation:*@struct _nlsversioninfo;,lpString:^w,cchStr:i||g
IsNativeVhdBoot|i|NativeVhdBoot:*i||1
IsNormalizedString|i|NormForm:u,lpString:^w,cwLength:i||g
IsProcessCritical|i|hProcess:&HANDLE;,Critical:*i||k
IsProcessInJob|i|ProcessHandle:&HANDLE;,JobHandle:&HANDLE;,Result:*i||y
IsProcessorFeaturePresent|i|ProcessorFeature:m||k
IsSystemResumeAutomatic|i|||1
IsThreadAFiber|i|||p
IsThreadpoolTimerSet|i|pti:*@struct _TP_TIMER;||b
IsUserCetAvailableInEnvironment|i|UserCetEnvironment:m||m
IsValidCodePage|i|CodePage:u||g
IsValidLanguageGroup|i|LanguageGroup:m,dwFlags:m||g
IsValidLocale|i|Locale:m,dwFlags:m||g
IsValidLocaleName|i|lpLocaleName:^w||g
IsValidNLSVersion|m|function:m,lpLocaleName:^w,lpVersionInformation:*@struct _nlsversioninfoex;||g
IsWow64GuestMachineSupported|l|WowGuestMachine:t,MachineIsSupported:*i||v
IsWow64Process|i|hProcess:&HANDLE;,Wow64Process:*i||v
IsWow64Process2|i|hProcess:&HANDLE;,pProcessMachine:*t,pNativeMachine:*t||v
K32EmptyWorkingSet|i|hProcess:&HANDLE;||z
K32EnumDeviceDrivers|i|lpImageBase:**v,cb:m,lpcbNeeded:*m||z
K32EnumPageFilesA|i|pCallBackRoutine:p,pContext:*v||z
K32EnumPageFilesW|i|pCallBackRoutine:p,pContext:*v||z
K32EnumProcessModules|i|hProcess:&HANDLE;,lphModule:*&HINSTANCE;,cb:m,lpcbNeeded:*m||z
K32EnumProcessModulesEx|i|hProcess:&HANDLE;,lphModule:*&HINSTANCE;,cb:m,lpcbNeeded:*m,dwFilterFlag:m||z
K32EnumProcesses|i|lpidProcess:*m,cb:m,cbNeeded:*m||z
K32GetDeviceDriverBaseNameA|m|ImageBase:*v,lpBaseName:*c,nSize:m||z
K32GetDeviceDriverBaseNameW|m|ImageBase:*v,lpBaseName:*w,nSize:m||z
K32GetDeviceDriverFileNameA|m|ImageBase:*v,lpFilename:*c,nSize:m||z
K32GetDeviceDriverFileNameW|m|ImageBase:*v,lpFilename:*w,nSize:m||z
K32GetMappedFileNameA|m|hProcess:&HANDLE;,lpv:*v,lpFilename:*c,nSize:m||z
K32GetMappedFileNameW|m|hProcess:&HANDLE;,lpv:*v,lpFilename:*w,nSize:m||z
K32GetModuleBaseNameA|m|hProcess:&HANDLE;,hModule:&HINSTANCE;,lpBaseName:*c,nSize:m||z
K32GetModuleBaseNameW|m|hProcess:&HANDLE;,hModule:&HINSTANCE;,lpBaseName:*w,nSize:m||z
K32GetModuleFileNameExA|m|hProcess:&HANDLE;,hModule:&HINSTANCE;,lpFilename:*c,nSize:m||z
K32GetModuleFileNameExW|m|hProcess:&HANDLE;,hModule:&HINSTANCE;,lpFilename:*w,nSize:m||z
K32GetModuleInformation|i|hProcess:&HANDLE;,hModule:&HINSTANCE;,lpmodinfo:*@struct _MODULEINFO;,cb:m||z
K32GetPerformanceInfo|i|pPerformanceInformation:*@struct _PERFORMANCE_INFORMATION;,cb:m||z
K32GetProcessImageFileNameA|m|hProcess:&HANDLE;,lpImageFileName:*c,nSize:m||z
K32GetProcessImageFileNameW|m|hProcess:&HANDLE;,lpImageFileName:*w,nSize:m||z
K32GetProcessMemoryInfo|i|Process:&HANDLE;,ppsmemCounters:*@PROCESS_MEMORY_COUNTERS;,cb:m||z
K32GetWsChanges|i|hProcess:&HANDLE;,lpWatchInfo:*@struct _PSAPI_WS_WATCH_INFORMATION;,cb:m||z
K32GetWsChangesEx|i|hProcess:&HANDLE;,lpWatchInfoEx:*@struct _PSAPI_WS_WATCH_INFORMATION_EX;,cb:m||z
K32InitializeProcessForWsWatch|i|hProcess:&HANDLE;||z
K32QueryWorkingSet|i|hProcess:&HANDLE;,pv:*v,cb:m||z
K32QueryWorkingSetEx|i|hProcess:&HANDLE;,pv:*v,cb:m||z
LCIDToLocaleName|i|Locale:m,lpName:*w,cchName:i,dwFlags:m||g
LCMapStringA|i|Locale:m,dwMapFlags:m,lpSrcStr:^c,cchSrc:i,lpDestStr:*c,cchDest:i||g
LCMapStringEx|i|lpLocaleName:^w,dwMapFlags:m,lpSrcStr:^w,cchSrc:i,lpDestStr:*w,cchDest:i,lpVersionInformation:*@struct _nlsversioninfo;,lpReserved:*v,sortHandle:q||g
LCMapStringW|i|Locale:m,dwMapFlags:m,lpSrcStr:^w,cchSrc:i,lpDestStr:*w,cchDest:i||g
LeaveCriticalSection|v|lpCriticalSection:*@struct _RTL_CRITICAL_SECTION;||0
LeaveCriticalSectionWhenCallbackReturns|v|pci:*@struct _TP_CALLBACK_INSTANCE;,pcs:*@struct _RTL_CRITICAL_SECTION;||b
LoadLibraryA|&HINSTANCE;|lpLibFileName:^c||3
LoadLibraryExA|&HINSTANCE;|lpLibFileName:^c,hFile:&HANDLE;,dwFlags:m||3
LoadLibraryExW|&HINSTANCE;|lpLibFileName:^w,hFile:&HANDLE;,dwFlags:m||3
LoadLibraryW|&HINSTANCE;|lpLibFileName:^w||3
LoadModule|m|lpModuleName:^c,lpParameterBlock:*v||1
LoadPackagedLibrary|&HINSTANCE;|lpwLibFileName:^w,Reserved:m||1
LoadResource|&HANDLE;|hModule:&HINSTANCE;,hResInfo:&HRSRC;||3
LocalAlloc|&HANDLE;|uFlags:u,uBytes:z||1
LocalCompact|z|uMinFree:u||1
LocalFileTimeToFileTime|i|lpLocalFileTime:^@FILETIME;,lpFileTime:*@struct _FILETIME;||9
LocalFlags|u|hMem:&HANDLE;||1
LocalFree|&HANDLE;|hMem:&HANDLE;||1
LocalHandle|&HANDLE;|pMem:^v||1
LocalLock|*v|hMem:&HANDLE;||1
LocalReAlloc|&HANDLE;|hMem:&HANDLE;,uBytes:z,uFlags:u||1
LocalShrink|z|hMem:&HANDLE;,cbNewSize:u||1
LocalSize|z|hMem:&HANDLE;||1
LocalUnlock|i|hMem:&HANDLE;||1
LocaleNameToLCID|m|lpName:^w,dwFlags:m||g
LocateXStateFeature|*v|Context:*@struct _CONTEXT;,FeatureId:m,Length:*m||1
LockFile|i|hFile:&HANDLE;,dwFileOffsetLow:m,dwFileOffsetHigh:m,nNumberOfBytesToLockLow:m,nNumberOfBytesToLockHigh:m||9
LockFileEx|i|hFile:&HANDLE;,dwFlags:m,dwReserved:m,nNumberOfBytesToLockLow:m,nNumberOfBytesToLockHigh:m,lpOverlapped:*@struct _OVERLAPPED;||9
LockResource|*v|hResData:&HANDLE;||3
MapUserPhysicalPages|i|VirtualAddress:*v,NumberOfPages:r,PageArray:*r||8
MapUserPhysicalPagesScatter|i|VirtualAddresses:**v,NumberOfPages:r,PageArray:*r||1
MapViewOfFile|*v|hFileMappingObject:&HANDLE;,dwDesiredAccess:m,dwFileOffsetHigh:m,dwFileOffsetLow:m,dwNumberOfBytesToMap:z||8
MapViewOfFileEx|*v|hFileMappingObject:&HANDLE;,dwDesiredAccess:m,dwFileOffsetHigh:m,dwFileOffsetLow:m,dwNumberOfBytesToMap:z,lpBaseAddress:*v||8
MapViewOfFileExNuma|*v|hFileMappingObject:&HANDLE;,dwDesiredAccess:m,dwFileOffsetHigh:m,dwFileOffsetLow:m,dwNumberOfBytesToMap:z,lpBaseAddress:*v,nndPreferred:m||1
MapViewOfFileFromApp|*v|hFileMappingObject:&HANDLE;,DesiredAccess:m,FileOffset:r,NumberOfBytesToMap:z||8
Module32First|i|hSnapshot:&HANDLE;,lpme:*@MODULEENTRY32;||l
Module32FirstW|i|hSnapshot:&HANDLE;,lpme:*@MODULEENTRY32W;||l
Module32Next|i|hSnapshot:&HANDLE;,lpme:*@MODULEENTRY32;||l
Module32NextW|i|hSnapshot:&HANDLE;,lpme:*@MODULEENTRY32W;||l
MoveFileA|i|lpExistingFileName:^c,lpNewFileName:^c||1
MoveFileExA|i|lpExistingFileName:^c,lpNewFileName:^c,dwFlags:m||1
MoveFileExW|i|lpExistingFileName:^w,lpNewFileName:^w,dwFlags:m||1
MoveFileTransactedA|i|lpExistingFileName:^c,lpNewFileName:^c,lpProgressRoutine:p,lpData:*v,dwFlags:m,hTransaction:&HANDLE;||1
MoveFileTransactedW|i|lpExistingFileName:^w,lpNewFileName:^w,lpProgressRoutine:p,lpData:*v,dwFlags:m,hTransaction:&HANDLE;||1
MoveFileW|i|lpExistingFileName:^w,lpNewFileName:^w||1
MoveFileWithProgressA|i|lpExistingFileName:^c,lpNewFileName:^c,lpProgressRoutine:p,lpData:*v,dwFlags:m||1
MoveFileWithProgressW|i|lpExistingFileName:^w,lpNewFileName:^w,lpProgressRoutine:p,lpData:*v,dwFlags:m||1
MulDiv|i|nNumber:i,nNumerator:i,nDenominator:i||1
MultiByteToWideChar|i|CodePage:u,dwFlags:m,lpMultiByteStr:^c,cbMultiByte:i,lpWideCharStr:*w,cchWideChar:i||h
MultiplyExtract128|q|Multiplier:q,Multiplicand:q,Shift:h||10
NeedCurrentDirectoryForExePathA|i|ExeName:^c||n
NeedCurrentDirectoryForExePathW|i|ExeName:^w||n
NormalizeString|i|NormForm:u,lpSrcString:^w,cwSrcLength:i,lpDstString:*w,cwDstLength:i||g
NotifyUILanguageChange|i|dwFlags:m,pcwstrNewLanguage:^w,pcwstrPreviousLanguage:^w,dwReserved:m,pdwStatusRtrn:*m||g
OfferVirtualMemory|m|VirtualAddress:*v,Size:z,Priority:u||8
OpenEventA|&HANDLE;|dwDesiredAccess:m,bInheritHandle:i,lpName:^c||0
OpenEventW|&HANDLE;|dwDesiredAccess:m,bInheritHandle:i,lpName:^w||0
OpenFile|i|lpFileName:^c,lpReOpenBuff:*@struct _OFSTRUCT;,uStyle:u||1
OpenFileById|&HANDLE;|hVolumeHint:&HANDLE;,lpFileId:*@struct FILE_ID_DESCRIPTOR;,dwDesiredAccess:m,dwShareMode:m,lpSecurityAttributes:*@struct _SECURITY_ATTRIBUTES;,dwFlagsAndAttributes:m||1
OpenFileMappingA|&HANDLE;|dwDesiredAccess:m,bInheritHandle:i,lpName:^c||1
OpenFileMappingW|&HANDLE;|dwDesiredAccess:m,bInheritHandle:i,lpName:^w||8
OpenJobObjectA|&HANDLE;|dwDesiredAccess:m,bInheritHandle:i,lpName:^c||1
OpenJobObjectW|&HANDLE;|dwDesiredAccess:m,bInheritHandle:i,lpName:^w||1
OpenMutexA|&HANDLE;|dwDesiredAccess:m,bInheritHandle:i,lpName:^c||1
OpenMutexW|&HANDLE;|dwDesiredAccess:m,bInheritHandle:i,lpName:^w||0
OpenPrivateNamespaceA|&HANDLE;|lpBoundaryDescriptor:*v,lpAliasPrefix:^c||1
OpenPrivateNamespaceW|&HANDLE;|lpBoundaryDescriptor:*v,lpAliasPrefix:^w||5
OpenProcess|&HANDLE;|dwDesiredAccess:m,bInheritHandle:i,dwProcessId:m||k
OpenSemaphoreA|&HANDLE;|dwDesiredAccess:m,bInheritHandle:i,lpName:^c||1
OpenSemaphoreW|&HANDLE;|dwDesiredAccess:m,bInheritHandle:i,lpName:^w||0
OpenThread|&HANDLE;|dwDesiredAccess:m,bInheritHandle:i,dwThreadId:m||k
OpenWaitableTimerA|&HANDLE;|dwDesiredAccess:m,bInheritHandle:i,lpTimerName:^c||1
OpenWaitableTimerW|&HANDLE;|dwDesiredAccess:m,bInheritHandle:i,lpTimerName:^w||0
OutputDebugStringA|v|lpOutputString:^c||e
OutputDebugStringW|v|lpOutputString:^w||e
PeekConsoleInputA|i|console_input:&HANDLE;,buffer:*@struct _INPUT_RECORD;,length:m,number_of_events_read:*m||7
PeekConsoleInputW|i|console_input:&HANDLE;,buffer:*@struct _INPUT_RECORD;,length:m,number_of_events_read:*m||7
PeekNamedPipe|i|hNamedPipe:&HANDLE;,lpBuffer:*v,nBufferSize:m,lpBytesRead:*m,lpTotalBytesAvail:*m,lpBytesLeftThisMessage:*m||i
PostQueuedCompletionStatus|i|CompletionPort:&HANDLE;,dwNumberOfBytesTransferred:m,dwCompletionKey:r,lpOverlapped:*@struct _OVERLAPPED;||c
PowerClearRequest|i|PowerRequest:&HANDLE;,RequestType:u||1
PowerCreateRequest|&HANDLE;|Context:*@struct _REASON_CONTEXT;||1
PowerSetRequest|i|PowerRequest:&HANDLE;,RequestType:u||1
PrefetchVirtualMemory|i|hProcess:&HANDLE;,NumberOfEntries:r,VirtualAddresses:*@struct _WIN32_MEMORY_RANGE_ENTRY;,Flags:m||8
PrepareTape|m|hDevice:&HANDLE;,dwOperation:m,bImmediate:i||1
Process32First|i|hSnapshot:&HANDLE;,lppe:*@PROCESSENTRY32;||l
Process32FirstW|i|hSnapshot:&HANDLE;,lppe:*@PROCESSENTRY32W;||l
Process32Next|i|hSnapshot:&HANDLE;,lppe:*@PROCESSENTRY32;||l
Process32NextW|i|hSnapshot:&HANDLE;,lppe:*@PROCESSENTRY32W;||l
ProcessIdToSessionId|i|dwProcessId:m,pSessionId:*m||k
PulseEvent|i|hEvent:&HANDLE;||1
PurgeComm|i|hFile:&HANDLE;,dwFlags:m||1
QueryActCtxSettingsW|i|dwFlags:m,hActCtx:&HANDLE;,settingsNameSpace:^w,settingName:^w,pvBuffer:*w,dwBuffer:z,pdwWrittenOrRequired:*z||1
QueryActCtxW|i|dwFlags:m,hActCtx:&HANDLE;,pvSubInstance:*v,ulInfoClass:m,pvBuffer:*v,cbBuffer:z,pcbWrittenOrRequired:*z||1
QueryDepthSList|t|ListHead:*@union _SLIST_HEADER;||w
QueryDosDeviceA|m|lpDeviceName:^c,lpTargetPath:*c,ucchMax:m||1
QueryDosDeviceW|m|lpDeviceName:^w,lpTargetPath:*w,ucchMax:m||9
QueryFullProcessImageNameA|i|hProcess:&HANDLE;,dwFlags:m,lpExeName:*c,lpdwSize:*m||1
QueryFullProcessImageNameW|i|hProcess:&HANDLE;,dwFlags:m,lpExeName:*w,lpdwSize:*m||1
QueryIdleProcessorCycleTime|i|BufferLength:*m,ProcessorIdleCycleTime:*r||11
QueryIdleProcessorCycleTimeEx|i|Group:t,BufferLength:*m,ProcessorIdleCycleTime:*r||11
QueryInformationJobObject|i|hJob:&HANDLE;,JobObjectInformationClass:u,lpJobObjectInformation:*v,cbJobObjectInformationLength:m,lpReturnLength:*m||1
QueryMemoryResourceNotification|i|ResourceNotificationHandle:&HANDLE;,ResourceState:*i||8
QueryPerformanceCounter|i|lpPerformanceCount:*@LARGE_INTEGER;||12
QueryPerformanceFrequency|i|lpFrequency:*@LARGE_INTEGER;||12
QueryProcessAffinityUpdateMode|i|hProcess:&HANDLE;,lpdwFlags:*m||k
QueryProcessCycleTime|i|ProcessHandle:&HANDLE;,CycleTime:*r||11
QueryProtectedPolicy|i|PolicyGuid:^@GUID;,PolicyValue:*r||k
QueryThreadCycleTime|i|ThreadHandle:&HANDLE;,CycleTime:*r||11
QueryThreadProfiling|m|ThreadHandle:&HANDLE;,Enabled:*h||1
QueryThreadpoolStackInformation|i|ptpp:*@struct _TP_POOL;,ptpsi:*@struct _TP_POOL_STACK_INFORMATION;||b
QueryUmsThreadInformation|i|UmsThread:*v,UmsThreadInfoClass:u,UmsThreadInformation:*v,UmsThreadInformationLength:m,ReturnLength:*m||1
QueryUnbiasedInterruptTime|i|UnbiasedTime:*r||11
QueueUserAPC|m|pfnAPC:p,hThread:&HANDLE;,dwData:r||k
QueueUserAPC2|i|ApcRoutine:p,Thread:&HANDLE;,Data:r,Flags:u||k
QueueUserWorkItem|i|Function:p,Context:*v,Flags:m||d
RaiseException|v|dwExceptionCode:m,dwExceptionFlags:m,nNumberOfArguments:m,lpArguments:^r||6
RaiseFailFastException|v|pExceptionRecord:*@EXCEPTION_RECORD;,pContextRecord:*@struct _CONTEXT;,dwFlags:m||1
ReOpenFile|&HANDLE;|hOriginalFile:&HANDLE;,dwDesiredAccess:m,dwShareMode:m,dwFlagsAndAttributes:m||1
ReadConsoleA|i|console_input:&HANDLE;,buffer:*v,number_of_chars_to_read:m,number_of_chars_read:*m,input_control:*@struct _CONSOLE_READCONSOLE_CONTROL;||7
ReadConsoleInputA|i|console_input:&HANDLE;,buffer:*@struct _INPUT_RECORD;,length:m,number_of_events_read:*m||7
ReadConsoleInputW|i|console_input:&HANDLE;,buffer:*@struct _INPUT_RECORD;,length:m,number_of_events_read:*m||7
ReadConsoleW|i|console_input:&HANDLE;,buffer:*v,number_of_chars_to_read:m,number_of_chars_read:*m,input_control:*@struct _CONSOLE_READCONSOLE_CONTROL;||7
ReadDirectoryChangesExW|i|hDirectory:&HANDLE;,lpBuffer:*v,nBufferLength:m,bWatchSubtree:i,dwNotifyFilter:m,lpBytesReturned:*m,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p,ReadDirectoryNotifyInformationClass:u||1
ReadDirectoryChangesW|i|hDirectory:&HANDLE;,lpBuffer:*v,nBufferLength:m,bWatchSubtree:i,dwNotifyFilter:m,lpBytesReturned:*m,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p||1
ReadFile|i|hFile:&HANDLE;,lpBuffer:*v,nNumberOfBytesToRead:m,lpNumberOfBytesRead:*m,lpOverlapped:*@struct _OVERLAPPED;||9
ReadFileEx|i|hFile:&HANDLE;,lpBuffer:*v,nNumberOfBytesToRead:m,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p||9
ReadFileScatter|i|hFile:&HANDLE;,aSegmentArray:*@FILE_SEGMENT_ELEMENT;,nNumberOfBytesToRead:m,lpReserved:*m,lpOverlapped:*@struct _OVERLAPPED;||9
ReadProcessMemory|i|hProcess:&HANDLE;,lpBaseAddress:^v,lpBuffer:*v,nSize:z,lpNumberOfBytesRead:*z||8
ReadThreadProfilingData|m|PerformanceDataHandle:&HANDLE;,Flags:m,PerformanceData:*@struct _PERFORMANCE_DATA;||1
ReclaimVirtualMemory|m|VirtualAddress:*v,Size:z||8
RegisterApplicationRecoveryCallback|l|pRecoveyCallback:p,pvParameter:*v,dwPingInterval:m,dwFlags:m||1
RegisterApplicationRestart|l|pwzCommandline:^w,dwFlags:m||1
RegisterBadMemoryNotification|*v|Callback:p||8
RegisterWaitForSingleObject|i|phNewWaitObject:*&HANDLE;,hObject:&HANDLE;,Callback:p,Context:*v,dwMilliseconds:m,dwFlags:m||1
ReleaseActCtx|v|hActCtx:&HANDLE;||1
ReleaseMutex|i|hMutex:&HANDLE;||0
ReleaseMutexWhenCallbackReturns|v|pci:*@struct _TP_CALLBACK_INSTANCE;,mut:&HANDLE;||b
ReleasePseudoConsole|l|pc:*v||7
ReleaseSRWLockExclusive|v|SRWLock:*@RTL_SRWLOCK;||0
ReleaseSRWLockShared|v|SRWLock:*@RTL_SRWLOCK;||0
ReleaseSemaphore|i|hSemaphore:&HANDLE;,lReleaseCount:l,lpPreviousCount:*l||0
ReleaseSemaphoreWhenCallbackReturns|v|pci:*@struct _TP_CALLBACK_INSTANCE;,sem:&HANDLE;,crel:m||b
RemoveDirectoryA|i|lpPathName:^c||9
RemoveDirectoryTransactedA|i|lpPathName:^c,hTransaction:&HANDLE;||1
RemoveDirectoryTransactedW|i|lpPathName:^w,hTransaction:&HANDLE;||1
RemoveDirectoryW|i|lpPathName:^w||9
RemoveDllDirectory|i|Cookie:*v||3
RemoveSecureMemoryCacheCallback|i|pfnCallBack:p||1
RemoveVectoredContinueHandler|m|Handle:*v||6
RemoveVectoredExceptionHandler|m|Handle:*v||6
ReplaceFileA|i|lpReplacedFileName:^c,lpReplacementFileName:^c,lpBackupFileName:^c,dwReplaceFlags:m,lpExclude:*v,lpReserved:*v||1
ReplaceFileW|i|lpReplacedFileName:^w,lpReplacementFileName:^w,lpBackupFileName:^w,dwReplaceFlags:m,lpExclude:*v,lpReserved:*v||1
ReplacePartitionUnit|i|TargetPartition:*w,SparePartition:*w,Flags:m||1
RequestDeviceWakeup|i|hDevice:&HANDLE;||1
ResetEvent|i|hEvent:&HANDLE;||0
ResetWriteWatch|u|lpBaseAddress:*v,dwRegionSize:z||8
ResolveLocaleName|i|lpNameToResolve:^w,lpLocaleName:*w,cchLocaleName:i||g
ResumeThread|m|hThread:&HANDLE;||k
RtlAddFunctionTable|h|FunctionTable:*@struct _RUNTIME_FUNCTION;,EntryCount:m,BaseAddress:r||10
RtlCaptureContext|v|ContextRecord:*@struct _CONTEXT;||10
RtlCaptureStackBackTrace|t|FramesToSkip:m,FramesToCapture:m,BackTrace:**v,BackTraceHash:*m||10
RtlCompareMemory|z|Source1:^v,Source2:^v,Length:z||10
RtlDeleteFunctionTable|h|FunctionTable:*@struct _RUNTIME_FUNCTION;||10
RtlInstallFunctionTableCallback|h|TableIdentifier:r,BaseAddress:r,Length:m,Callback:p,Context:*v,OutOfProcessCallbackDll:^w||10
RtlIsEcCode|h|CodePointer:r||10
RtlLookupFunctionEntry|*@struct _RUNTIME_FUNCTION;|ControlPc:r,ImageBase:*r,HistoryTable:*@struct _UNWIND_HISTORY_TABLE;||10
RtlPcToFileHeader|*v|PcValue:*v,BaseOfImage:**v||10
RtlRestoreContext|v|ContextRecord:*@struct _CONTEXT;,ExceptionRecord:*@struct _EXCEPTION_RECORD;|n|10
RtlSecureZeroMemory|*v|ptr:*v,cnt:z||10
RtlUnwind|v|TargetFrame:*v,TargetIp:*v,ExceptionRecord:*@EXCEPTION_RECORD;,ReturnValue:*v||10
RtlUnwindEx|v|TargetFrame:*v,TargetIp:*v,ExceptionRecord:*@EXCEPTION_RECORD;,ReturnValue:*v,ContextRecord:*@struct _CONTEXT;,HistoryTable:*@struct _UNWIND_HISTORY_TABLE;||10
RtlVirtualUnwind|p|HandlerType:m,ImageBase:r,ControlPc:r,FunctionEntry:*@struct _RUNTIME_FUNCTION;,ContextRecord:*@struct _CONTEXT;,HandlerData:**v,EstablisherFrame:*r,ContextPointers:*@struct _KNONVOLATILE_CONTEXT_POINTERS;||10
SearchPathA|m|lpPath:^c,lpFileName:^c,lpExtension:^c,nBufferLength:m,lpBuffer:*c,lpFilePart:**c||n
SearchPathW|m|lpPath:^w,lpFileName:^w,lpExtension:^w,nBufferLength:m,lpBuffer:*w,lpFilePart:**w||n
SetCachedSigningLevel|i|SourceFiles:*&HANDLE;,SourceFileCount:m,Flags:m,TargetFile:&HANDLE;||4
SetCalendarInfoA|i|Locale:m,Calendar:m,CalType:m,lpCalData:^c||g
SetCalendarInfoW|i|Locale:m,Calendar:m,CalType:m,lpCalData:^w||g
SetCommBreak|i|hFile:&HANDLE;||1
SetCommConfig|i|hCommDev:&HANDLE;,lpCC:*@struct _COMMCONFIG;,dwSize:m||1
SetCommMask|i|hFile:&HANDLE;,dwEvtMask:m||1
SetCommState|i|hFile:&HANDLE;,lpDCB:*@struct _DCB;||1
SetCommTimeouts|i|hFile:&HANDLE;,lpCommTimeouts:*@struct _COMMTIMEOUTS;||1
SetComputerNameA|i|lpComputerName:^c||1
SetComputerNameExA|i|NameType:u,lpBuffer:^c||1
SetComputerNameExW|i|NameType:u,lpBuffer:^w||m
SetComputerNameW|i|lpComputerName:^w||1
SetConsoleActiveScreenBuffer|i|console_output:&HANDLE;||j
SetConsoleCP|i|code_page_id:u||j
SetConsoleCtrlHandler|i|handler_routine:p,add:i||7
SetConsoleCursorInfo|i|console_output:&HANDLE;,console_cursor_info:^@CONSOLE_CURSOR_INFO;||j
SetConsoleDisplayMode|i|console_output:&HANDLE;,flags:m,new_screen_buffer_dimensions:*@struct _COORD;||2
SetConsoleHistoryInfo|i|console_history_info:*@struct _CONSOLE_HISTORY_INFO;||2
SetConsoleMode|i|console_handle:&HANDLE;,mode:m||7
SetConsoleNumberOfCommandsA|i|number:m,exe_name:*c||2
SetConsoleNumberOfCommandsW|i|number:m,exe_name:*w||2
SetConsoleOutputCP|i|code_page_id:u||j
SetConsoleScreenBufferInfoEx|i|console_output:&HANDLE;,console_screen_buffer_info_ex:*@struct _CONSOLE_SCREEN_BUFFER_INFOEX;||j
SetConsoleTextAttribute|i|console_output:&HANDLE;,attributes:t||j
SetConsoleTitleA|i|console_title:^c||j
SetConsoleTitleW|i|console_title:^w||j
SetConsoleWindowInfo|i|console_output:&HANDLE;,absolute:i,console_window:^@SMALL_RECT;||j
SetCriticalSectionSpinCount|m|lpCriticalSection:*@struct _RTL_CRITICAL_SECTION;,dwSpinCount:m||0
SetCurrentConsoleFontEx|i|console_output:&HANDLE;,maximum_window:i,console_current_font_ex:*@struct _CONSOLE_FONT_INFOEX;||2
SetCurrentDirectoryA|i|lpPathName:^c||n
SetCurrentDirectoryW|i|lpPathName:^w||n
SetDefaultCommConfigA|i|lpszName:^c,lpCC:*@struct _COMMCONFIG;,dwSize:m||1
SetDefaultCommConfigW|i|lpszName:^w,lpCC:*@struct _COMMCONFIG;,dwSize:m||1
SetDefaultDllDirectories|i|DirectoryFlags:m||3
SetDllDirectoryA|i|lpPathName:^c||1
SetDllDirectoryW|i|lpPathName:^w||1
SetDynamicTimeZoneInformation|i|lpTimeZoneInformation:^@DYNAMIC_TIME_ZONE_INFORMATION;||o
SetEndOfFile|i|hFile:&HANDLE;||9
SetEnvironmentStringsA|i|NewEnvironment:*c||1
SetEnvironmentStringsW|i|NewEnvironment:*w||n
SetEnvironmentVariableA|i|lpName:^c,lpValue:^c||n
SetEnvironmentVariableW|i|lpName:^w,lpValue:^w||n
SetErrorMode|u|uMode:u||6
SetEvent|i|hEvent:&HANDLE;||0
SetEventWhenCallbackReturns|v|pci:*@struct _TP_CALLBACK_INSTANCE;,evt:&HANDLE;||b
SetFileApisToANSI|v|||1
SetFileApisToOEM|v|||1
SetFileAttributesA|i|lpFileName:^c,dwFileAttributes:m||9
SetFileAttributesTransactedA|i|lpFileName:^c,dwFileAttributes:m,hTransaction:&HANDLE;||1
SetFileAttributesTransactedW|i|lpFileName:^w,dwFileAttributes:m,hTransaction:&HANDLE;||1
SetFileAttributesW|i|lpFileName:^w,dwFileAttributes:m||9
SetFileBandwidthReservation|i|hFile:&HANDLE;,nPeriodMilliseconds:m,nBytesPerPeriod:m,bDiscardable:i,lpTransferSize:*m,lpNumOutstandingRequests:*m||1
SetFileCompletionNotificationModes|i|FileHandle:&HANDLE;,Flags:h||1
SetFileInformationByHandle|i|hFile:&HANDLE;,FileInformationClass:u,lpFileInformation:*v,dwBufferSize:m||9
SetFileIoOverlappedRange|i|FileHandle:&HANDLE;,OverlappedRangeStart:*h,Length:m||1
SetFilePointer|m|hFile:&HANDLE;,lDistanceToMove:l,lpDistanceToMoveHigh:*l,dwMoveMethod:m||9
SetFileShortNameA|i|hFile:&HANDLE;,lpShortName:^c||1
SetFileShortNameW|i|hFile:&HANDLE;,lpShortName:^w||1
SetFileTime|i|hFile:&HANDLE;,lpCreationTime:^@FILETIME;,lpLastAccessTime:^@FILETIME;,lpLastWriteTime:^@FILETIME;||9
SetFileValidData|i|hFile:&HANDLE;,ValidDataLength:q||9
SetFirmwareEnvironmentVariableA|i|lpName:^c,lpGuid:^c,pValue:*v,nSize:m||1
SetFirmwareEnvironmentVariableExA|i|lpName:^c,lpGuid:^c,pValue:*v,nSize:m,dwAttributes:m||1
SetFirmwareEnvironmentVariableExW|i|lpName:^w,lpGuid:^w,pValue:*v,nSize:m,dwAttributes:m||1
SetFirmwareEnvironmentVariableW|i|lpName:^w,lpGuid:^w,pValue:*v,nSize:m||1
SetHandleCount|u|uNumber:u||1
SetHandleInformation|i|hObject:&HANDLE;,dwMask:m,dwFlags:m||f
SetInformationJobObject|i|hJob:&HANDLE;,JobObjectInformationClass:u,lpJobObjectInformation:*v,cbJobObjectInformationLength:m||1
SetLastError|v|dwErrCode:m||6
SetLocalTime|i|lpSystemTime:^@SYSTEMTIME;||m
SetLocaleInfoA|i|Locale:m,LCType:m,lpLCData:^c||g
SetLocaleInfoW|i|Locale:m,LCType:m,lpLCData:^w||g
SetMailslotInfo|i|hMailslot:&HANDLE;,lReadTimeout:m||1
SetMessageWaitingIndicator|i|hMsgIndicator:&HANDLE;,ulMsgCount:m||1
SetNamedPipeHandleState|i|hNamedPipe:&HANDLE;,lpMode:*m,lpMaxCollectionCount:*m,lpCollectDataTimeout:*m||i
SetPriorityClass|i|hProcess:&HANDLE;,dwPriorityClass:m||k
SetProcessAffinityMask|i|hProcess:&HANDLE;,dwProcessAffinityMask:r||1
SetProcessAffinityUpdateMode|i|hProcess:&HANDLE;,dwFlags:m||k
SetProcessDEPPolicy|i|dwFlags:m||1
SetProcessDefaultCpuSetMasks|i|Process:&HANDLE;,CpuSetMasks:*@struct _GROUP_AFFINITY;,CpuSetMaskCount:t||k
SetProcessDefaultCpuSets|i|Process:&HANDLE;,CpuSetIds:^m,CpuSetIdCount:m||k
SetProcessDynamicEHContinuationTargets|i|Process:&HANDLE;,NumberOfTargets:t,Targets:*@struct _PROCESS_DYNAMIC_EH_CONTINUATION_TARGET;||k
SetProcessDynamicEnforcedCetCompatibleRanges|i|Process:&HANDLE;,NumberOfRanges:t,Ranges:*@struct _PROCESS_DYNAMIC_ENFORCED_ADDRESS_RANGE;||k
SetProcessInformation|i|hProcess:&HANDLE;,ProcessInformationClass:u,ProcessInformation:*v,ProcessInformationSize:m||k
SetProcessMitigationPolicy|i|MitigationPolicy:u,lpBuffer:*v,dwLength:z||k
SetProcessPreferredUILanguages|i|dwFlags:m,pwszLanguagesBuffer:^w,pulNumLanguages:*m||g
SetProcessPriorityBoost|i|hProcess:&HANDLE;,bDisablePriorityBoost:i||1
SetProcessShutdownParameters|i|dwLevel:m,dwFlags:m||k
SetProcessWorkingSetSize|i|hProcess:&HANDLE;,dwMinimumWorkingSetSize:z,dwMaximumWorkingSetSize:z||1
SetProcessWorkingSetSizeEx|i|hProcess:&HANDLE;,dwMinimumWorkingSetSize:z,dwMaximumWorkingSetSize:z,Flags:m||8
SetProtectedPolicy|i|PolicyGuid:^@GUID;,PolicyValue:r,OldPolicyValue:*r||k
SetSearchPathMode|i|Flags:m||1
SetStdHandle|i|nStdHandle:m,hHandle:&HANDLE;||n
SetStdHandleEx|i|nStdHandle:m,hHandle:&HANDLE;,phPrevValue:*&HANDLE;||n
SetSystemFileCacheSize|i|MinimumFileCacheSize:z,MaximumFileCacheSize:z,Flags:m||8
SetSystemPowerState|i|fSuspend:i,fForce:i||1
SetSystemTime|i|lpSystemTime:^@SYSTEMTIME;||m
SetSystemTimeAdjustment|i|dwTimeAdjustment:m,bTimeAdjustmentDisabled:i||1
SetTapeParameters|m|hDevice:&HANDLE;,dwOperation:m,lpTapeInformation:*v||1
SetTapePosition|m|hDevice:&HANDLE;,dwPositionMethod:m,dwPartition:m,dwOffsetLow:m,dwOffsetHigh:m,bImmediate:i||1
SetThreadAffinityMask|r|hThread:&HANDLE;,dwThreadAffinityMask:r||1
SetThreadContext|i|hThread:&HANDLE;,lpContext:^@CONTEXT;||k
SetThreadDescription|l|hThread:&HANDLE;,lpThreadDescription:^w||k
SetThreadErrorMode|i|dwNewMode:m,lpOldMode:*m||1
SetThreadExecutionState|m|esFlags:m||1
SetThreadGroupAffinity|i|hThread:&HANDLE;,GroupAffinity:^@GROUP_AFFINITY;,PreviousGroupAffinity:*@struct _GROUP_AFFINITY;||t
SetThreadIdealProcessor|m|hThread:&HANDLE;,dwIdealProcessor:m||1
SetThreadIdealProcessorEx|i|hThread:&HANDLE;,lpIdealProcessor:*@struct _PROCESSOR_NUMBER;,lpPreviousIdealProcessor:*@struct _PROCESSOR_NUMBER;||k
SetThreadInformation|i|hThread:&HANDLE;,ThreadInformationClass:u,ThreadInformation:*v,ThreadInformationSize:m||1
SetThreadLocale|i|Locale:m||g
SetThreadPreferredUILanguages|i|dwFlags:m,pwszLanguagesBuffer:^w,pulNumLanguages:*m||g
SetThreadPriority|i|hThread:&HANDLE;,nPriority:i||k
SetThreadPriorityBoost|i|hThread:&HANDLE;,bDisablePriorityBoost:i||k
SetThreadSelectedCpuSetMasks|i|Thread:&HANDLE;,CpuSetMasks:*@struct _GROUP_AFFINITY;,CpuSetMaskCount:t||k
SetThreadSelectedCpuSets|i|Thread:&HANDLE;,CpuSetIds:^m,CpuSetIdCount:m||k
SetThreadStackGuarantee|i|StackSizeInBytes:*m||k
SetThreadUILanguage|t|LangId:t||g
SetThreadpoolStackInformation|i|ptpp:*@struct _TP_POOL;,ptpsi:*@struct _TP_POOL_STACK_INFORMATION;||b
SetThreadpoolThreadMaximum|v|ptpp:*@struct _TP_POOL;,cthrdMost:m||b
SetThreadpoolThreadMinimum|i|ptpp:*@struct _TP_POOL;,cthrdMic:m||b
SetThreadpoolTimer|v|pti:*@struct _TP_TIMER;,pftDueTime:*@struct _FILETIME;,msPeriod:m,msWindowLength:m||b
SetThreadpoolTimerEx|i|pti:*@struct _TP_TIMER;,pftDueTime:*@struct _FILETIME;,msPeriod:m,msWindowLength:m||b
SetThreadpoolWait|v|pwa:*@struct _TP_WAIT;,h:&HANDLE;,pftTimeout:*@struct _FILETIME;||b
SetThreadpoolWaitEx|i|pwa:*@struct _TP_WAIT;,h:&HANDLE;,pftTimeout:*@struct _FILETIME;,Reserved:*v||b
SetTimeZoneInformation|i|lpTimeZoneInformation:^@TIME_ZONE_INFORMATION;||o
SetTimerQueueTimer|&HANDLE;|TimerQueue:&HANDLE;,Callback:p,Parameter:*v,DueTime:m,Period:m,PreferIo:i||1
SetUmsThreadInformation|i|UmsThread:*v,UmsThreadInfoClass:u,UmsThreadInformation:*v,UmsThreadInformationLength:m||1
SetUnhandledExceptionFilter|p|lpTopLevelExceptionFilter:p||6
SetUserGeoID|i|GeoId:l||g
SetUserGeoName|i|geoName:*w||g
SetVolumeLabelA|i|lpRootPathName:^c,lpVolumeName:^c||1
SetVolumeLabelW|i|lpRootPathName:^w,lpVolumeName:^w||1
SetVolumeMountPointA|i|lpszVolumeMountPoint:^c,lpszVolumeName:^c||1
SetVolumeMountPointW|i|lpszVolumeMountPoint:^w,lpszVolumeName:^w||1
SetWaitableTimer|i|hTimer:&HANDLE;,lpDueTime:^@LARGE_INTEGER;,lPeriod:l,pfnCompletionRoutine:p,lpArgToCompletionRoutine:*v,fResume:i||0
SetWaitableTimerEx|i|hTimer:&HANDLE;,lpDueTime:^@LARGE_INTEGER;,lPeriod:l,pfnCompletionRoutine:p,lpArgToCompletionRoutine:*v,WakeContext:*@struct _REASON_CONTEXT;,TolerableDelay:m||0
SetXStateFeaturesMask|i|Context:*@struct _CONTEXT;,FeatureMask:r||1
SetupComm|i|hFile:&HANDLE;,dwInQueue:m,dwOutQueue:m||1
SignalObjectAndWait|m|hObjectToSignal:&HANDLE;,hObjectToWaitOn:&HANDLE;,dwMilliseconds:m,bAlertable:i||0
SizeofResource|m|hModule:&HINSTANCE;,hResInfo:&HRSRC;||3
Sleep|v|dwMilliseconds:m||0
SleepConditionVariableCS|i|ConditionVariable:*@RTL_CONDITION_VARIABLE;,CriticalSection:*@struct _RTL_CRITICAL_SECTION;,dwMilliseconds:m||0
SleepConditionVariableSRW|i|ConditionVariable:*@RTL_CONDITION_VARIABLE;,SRWLock:*@RTL_SRWLOCK;,dwMilliseconds:m,Flags:m||0
SleepEx|m|dwMilliseconds:m,bAlertable:i||0
StartThreadpoolIo|v|pio:*@struct _TP_IO;||b
SubmitThreadpoolWork|v|pwk:*@struct _TP_WORK;||b
SuspendThread|m|hThread:&HANDLE;||k
SwitchToFiber|v|lpFiber:*v||1
SwitchToThread|i|||k
SystemTimeToFileTime|i|lpSystemTime:^@SYSTEMTIME;,lpFileTime:*@struct _FILETIME;||o
SystemTimeToTzSpecificLocalTime|i|lpTimeZoneInformation:^@TIME_ZONE_INFORMATION;,lpUniversalTime:^@SYSTEMTIME;,lpLocalTime:*@struct _SYSTEMTIME;||o
SystemTimeToTzSpecificLocalTimeEx|i|lpTimeZoneInformation:^@DYNAMIC_TIME_ZONE_INFORMATION;,lpUniversalTime:^@SYSTEMTIME;,lpLocalTime:*@struct _SYSTEMTIME;||o
TerminateJobObject|i|hJob:&HANDLE;,uExitCode:u||1
TerminateProcess|i|hProcess:&HANDLE;,uExitCode:u||k
TerminateThread|i|hThread:&HANDLE;,dwExitCode:m||k
Thread32First|i|hSnapshot:&HANDLE;,lpte:*@THREADENTRY32;||l
Thread32Next|i|hSnapshot:&HANDLE;,lpte:*@THREADENTRY32;||l
TlsAlloc|m|||k
TlsFree|i|dwTlsIndex:m||k
TlsGetValue|*v|dwTlsIndex:m||k
TlsGetValue2|*v|dwTlsIndex:m||k
TlsSetValue|i|dwTlsIndex:m,lpTlsValue:*v||k
Toolhelp32ReadProcessMemory|i|th32ProcessID:m,lpBaseAddress:^v,lpBuffer:*v,cbRead:z,lpNumberOfBytesRead:*z||l
TransactNamedPipe|i|hNamedPipe:&HANDLE;,lpInBuffer:*v,nInBufferSize:m,lpOutBuffer:*v,nOutBufferSize:m,lpBytesRead:*m,lpOverlapped:*@struct _OVERLAPPED;||i
TransmitCommChar|i|hFile:&HANDLE;,cChar:c||1
TryAcquireSRWLockExclusive|h|SRWLock:*@RTL_SRWLOCK;||0
TryAcquireSRWLockShared|h|SRWLock:*@RTL_SRWLOCK;||0
TryEnterCriticalSection|i|lpCriticalSection:*@struct _RTL_CRITICAL_SECTION;||0
TrySubmitThreadpoolCallback|i|pfns:p,pv:*v,pcbe:*@TP_CALLBACK_ENVIRON_V3;||b
TzSpecificLocalTimeToSystemTime|i|lpTimeZoneInformation:^@TIME_ZONE_INFORMATION;,lpLocalTime:^@SYSTEMTIME;,lpUniversalTime:*@struct _SYSTEMTIME;||o
TzSpecificLocalTimeToSystemTimeEx|i|lpTimeZoneInformation:^@DYNAMIC_TIME_ZONE_INFORMATION;,lpLocalTime:^@SYSTEMTIME;,lpUniversalTime:*@struct _SYSTEMTIME;||o
UmsThreadYield|i|SchedulerParam:*v||1
UnhandledExceptionFilter|l|ExceptionInfo:*@struct _EXCEPTION_POINTERS;||6
UnlockFile|i|hFile:&HANDLE;,dwFileOffsetLow:m,dwFileOffsetHigh:m,nNumberOfBytesToUnlockLow:m,nNumberOfBytesToUnlockHigh:m||9
UnlockFileEx|i|hFile:&HANDLE;,dwReserved:m,nNumberOfBytesToUnlockLow:m,nNumberOfBytesToUnlockHigh:m,lpOverlapped:*@struct _OVERLAPPED;||9
UnmapViewOfFile|i|lpBaseAddress:^v||8
UnmapViewOfFileEx|i|BaseAddress:*v,UnmapFlags:m||8
UnregisterApplicationRecoveryCallback|l|||1
UnregisterApplicationRestart|l|||1
UnregisterBadMemoryNotification|i|RegistrationHandle:*v||8
UnregisterWait|i|WaitHandle:&HANDLE;||1
UnregisterWaitEx|i|WaitHandle:&HANDLE;,CompletionEvent:&HANDLE;||d
UnsignedMultiplyExtract128|r|Multiplier:r,Multiplicand:r,Shift:h||10
UpdateProcThreadAttribute|i|lpAttributeList:*@struct _PROC_THREAD_ATTRIBUTE_LIST;,dwFlags:m,Attribute:r,lpValue:*v,cbSize:z,lpPreviousValue:*v,lpReturnSize:*r||k
UpdateResourceA|i|hUpdate:&HANDLE;,lpType:^c,lpName:^c,wLanguage:t,lpData:*v,cb:m||1
UpdateResourceW|i|hUpdate:&HANDLE;,lpType:^w,lpName:^w,wLanguage:t,lpData:*v,cb:m||1
VerLanguageNameA|m|wLang:m,szLang:*c,nSize:m||13
VerLanguageNameW|m|wLang:m,szLang:*w,nSize:m||13
VerSetConditionMask|r|ConditionMask:r,TypeMask:m,Condition:h||10
VerifyScripts|i|dwFlags:m,lpLocaleScripts:^w,cchLocaleScripts:i,lpTestScripts:^w,cchTestScripts:i||g
VerifyVersionInfoA|i|lpVersionInformation:*@struct _OSVERSIONINFOEXA;,dwTypeMask:m,dwlConditionMask:r||1
VerifyVersionInfoW|i|lpVersionInformation:*@struct _OSVERSIONINFOEXW;,dwTypeMask:m,dwlConditionMask:r||1
VirtualAlloc|*v|lpAddress:*v,dwSize:z,flAllocationType:m,flProtect:m||8
VirtualAllocEx|*v|hProcess:&HANDLE;,lpAddress:*v,dwSize:z,flAllocationType:m,flProtect:m||8
VirtualAllocExNuma|*v|hProcess:&HANDLE;,lpAddress:*v,dwSize:z,flAllocationType:m,flProtect:m,nndPreferred:m||8
VirtualFree|i|lpAddress:*v,dwSize:z,dwFreeType:m||8
VirtualFreeEx|i|hProcess:&HANDLE;,lpAddress:*v,dwSize:z,dwFreeType:m||8
VirtualLock|i|lpAddress:*v,dwSize:z||8
VirtualProtect|i|lpAddress:*v,dwSize:z,flNewProtect:m,lpflOldProtect:*m||8
VirtualProtectEx|i|hProcess:&HANDLE;,lpAddress:*v,dwSize:z,flNewProtect:m,lpflOldProtect:*m||8
VirtualQuery|z|lpAddress:^v,lpBuffer:*@struct _MEMORY_BASIC_INFORMATION;,dwLength:z||8
VirtualQueryEx|z|hProcess:&HANDLE;,lpAddress:^v,lpBuffer:*@struct _MEMORY_BASIC_INFORMATION;,dwLength:z||8
VirtualUnlock|i|lpAddress:*v,dwSize:z||8
WTSGetActiveConsoleSessionId|m|||1
WaitCommEvent|i|hFile:&HANDLE;,lpEvtMask:*m,lpOverlapped:*@struct _OVERLAPPED;||1
WaitForDebugEvent|i|lpDebugEvent:*@struct _DEBUG_EVENT;,dwMilliseconds:m||e
WaitForDebugEventEx|i|lpDebugEvent:*@struct _DEBUG_EVENT;,dwMilliseconds:m||e
WaitForMultipleObjects|m|nCount:m,lpHandles:^&HANDLE;,bWaitAll:i,dwMilliseconds:m||1
WaitForMultipleObjectsEx|m|nCount:m,lpHandles:^&HANDLE;,bWaitAll:i,dwMilliseconds:m,bAlertable:i||0
WaitForSingleObject|m|hHandle:&HANDLE;,dwMilliseconds:m||0
WaitForSingleObjectEx|m|hHandle:&HANDLE;,dwMilliseconds:m,bAlertable:i||0
WaitForThreadpoolIoCallbacks|v|pio:*@struct _TP_IO;,fCancelPendingCallbacks:i||b
WaitForThreadpoolTimerCallbacks|v|pti:*@struct _TP_TIMER;,fCancelPendingCallbacks:i||b
WaitForThreadpoolWaitCallbacks|v|pwa:*@struct _TP_WAIT;,fCancelPendingCallbacks:i||b
WaitForThreadpoolWorkCallbacks|v|pwk:*@struct _TP_WORK;,fCancelPendingCallbacks:i||b
WaitNamedPipeA|i|lpNamedPipeName:^c,nTimeOut:m||1
WaitNamedPipeW|i|lpNamedPipeName:^w,nTimeOut:m||i
WakeAllConditionVariable|v|ConditionVariable:*@RTL_CONDITION_VARIABLE;||0
WakeConditionVariable|v|ConditionVariable:*@RTL_CONDITION_VARIABLE;||0
WideCharToMultiByte|i|CodePage:u,dwFlags:m,lpWideCharStr:^w,cchWideChar:i,lpMultiByteStr:*c,cbMultiByte:i,lpDefaultChar:^c,lpUsedDefaultChar:*i||h
WinExec|u|lpCmdLine:^c,uCmdShow:u||1
Wow64DisableWow64FsRedirection|i|OldValue:**v||v
Wow64EnableWow64FsRedirection|h|Wow64FsEnableRedirection:h||1
Wow64GetThreadContext|i|hThread:&HANDLE;,lpContext:*@struct _WOW64_CONTEXT;||v
Wow64GetThreadSelectorEntry|i|hThread:&HANDLE;,dwSelector:m,lpSelectorEntry:*@struct _WOW64_LDT_ENTRY;||1
Wow64RevertWow64FsRedirection|i|OlValue:*v||v
Wow64SetThreadContext|i|hThread:&HANDLE;,lpContext:^@WOW64_CONTEXT;||v
Wow64SuspendThread|m|hThread:&HANDLE;||v
WriteConsoleA|i|console_output:&HANDLE;,buffer:^v,number_of_chars_to_write:m,number_of_chars_written:*m,reserved:*v||7
WriteConsoleInputA|i|console_input:&HANDLE;,buffer:^@INPUT_RECORD;,length:m,number_of_events_written:*m||j
WriteConsoleInputW|i|console_input:&HANDLE;,buffer:^@INPUT_RECORD;,length:m,number_of_events_written:*m||j
WriteConsoleW|i|console_output:&HANDLE;,buffer:^v,number_of_chars_to_write:m,number_of_chars_written:*m,reserved:*v||7
WriteFile|i|hFile:&HANDLE;,lpBuffer:^v,nNumberOfBytesToWrite:m,lpNumberOfBytesWritten:*m,lpOverlapped:*@struct _OVERLAPPED;||9
WriteFileEx|i|hFile:&HANDLE;,lpBuffer:^v,nNumberOfBytesToWrite:m,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p||9
WriteFileGather|i|hFile:&HANDLE;,aSegmentArray:*@FILE_SEGMENT_ELEMENT;,nNumberOfBytesToWrite:m,lpReserved:*m,lpOverlapped:*@struct _OVERLAPPED;||9
WritePrivateProfileSectionA|i|lpAppName:^c,lpString:^c,lpFileName:^c||1
WritePrivateProfileSectionW|i|lpAppName:^w,lpString:^w,lpFileName:^w||1
WritePrivateProfileStringA|i|lpAppName:^c,lpKeyName:^c,lpString:^c,lpFileName:^c||1
WritePrivateProfileStringW|i|lpAppName:^w,lpKeyName:^w,lpString:^w,lpFileName:^w||1
WritePrivateProfileStructA|i|lpszSection:^c,lpszKey:^c,lpStruct:*v,uSizeStruct:u,szFile:^c||1
WritePrivateProfileStructW|i|lpszSection:^w,lpszKey:^w,lpStruct:*v,uSizeStruct:u,szFile:^w||1
WriteProcessMemory|i|hProcess:&HANDLE;,lpBaseAddress:*v,lpBuffer:^v,nSize:z,lpNumberOfBytesWritten:*z||8
WriteProfileSectionA|i|lpAppName:^c,lpString:^c||1
WriteProfileSectionW|i|lpAppName:^w,lpString:^w||1
WriteProfileStringA|i|lpAppName:^c,lpKeyName:^c,lpString:^c||1
WriteProfileStringW|i|lpAppName:^w,lpKeyName:^w,lpString:^w||1
WriteTapemark|m|hDevice:&HANDLE;,dwTapemarkType:m,dwTapemarkCount:m,bImmediate:i||1
ZombifyActCtx|i|hActCtx:&HANDLE;||1
_BitScanForward|h|Index:*m,Mask:m||x
_BitScanForward64|h|Index:*m,Mask:r||x
_BitScanReverse|h|Index:*m,Mask:m||x
_BitScanReverse64|h|Index:*m,Mask:r||x
_InterlockedAdd|l|Addend:*l,Value:l||x
_InterlockedAdd64|q|Addend:*q,Value:q||x
_InterlockedAnd|l|Destination:*l,Value:l||x
_InterlockedAnd64|q|Destination:*q,Value:q||x
_InterlockedCompareExchange|l|Destination:*l,ExChange:l,Comperand:l||x
_InterlockedCompareExchange16|s|Destination:*s,ExChange:s,Comperand:s||x
_InterlockedCompareExchange64|q|Destination:*q,ExChange:q,Comperand:q||x
_InterlockedCompareExchangePointer|*v|Destination:**v,ExChange:*v,Comperand:*v||x
_InterlockedDecrement|l|Addend:*l||x
_InterlockedDecrement16|s|Addend:*s||x
_InterlockedDecrement64|q|Addend:*q||x
_InterlockedExchange|l|Target:*l,Value:l||x
_InterlockedExchange64|q|Target:*q,Value:q||x
_InterlockedExchangeAdd|l|Addend:*l,Value:l||x
_InterlockedExchangeAdd64|q|Addend:*q,Value:q||x
_InterlockedExchangePointer|*v|Target:**v,Value:*v||x
_InterlockedIncrement|l|Addend:*l||x
_InterlockedIncrement16|s|Addend:*s||x
_InterlockedIncrement64|q|Addend:*q||x
_InterlockedOr|l|Destination:*l,Value:l||x
_InterlockedOr64|q|Destination:*q,Value:q||x
_InterlockedXor|l|Destination:*l,Value:l||x
_InterlockedXor64|q|Destination:*q,Value:q||x
__C_specific_handler|i|ExceptionRecord:*@struct _EXCEPTION_RECORD;,EstablisherFrame:*v,ContextRecord:*@struct _CONTEXT;,DispatcherContext:*@struct _DISPATCHER_CONTEXT;||14
__faststorefence|v|||x
__int2c|v|||x
__movsb|v|Destination:*h,Source:^h,Count:z||x
__movsd|v|Dest:*m,Source:^m,Count:z||x
__movsq|v|Dest:*r,Source:^r,Count:z||x
__movsw|v|Dest:*t,Source:^t,Count:z||x
__readgsbyte|h|Offset:m||x
__readgsdword|m|Offset:m||x
__readgsqword|r|Offset:m||x
__readgsword|t|Offset:m||x
__shiftleft128|r|LowPart:r,HighPart:r,Shift:h||10
__shiftright128|r|LowPart:r,HighPart:r,Shift:h||10
__stosb|v|Dest:*h,Data:h,Count:z||x
__stosd|v|Dest:*m,Data:m,Count:z||x
__stosq|v|Dest:*r,Data:r,Count:z||x
__stosw|v|Dest:*t,Data:t,Count:z||x
__writegsbyte|v|Offset:m,Data:h||x
__writegsdword|v|Offset:m,Data:m||x
__writegsqword|v|Offset:m,Data:r||x
__writegsword|v|Offset:m,Data:t||x
_bittest|h|a:^l,b:l||x
_bittest64|h|a:^q,b:q||x
_bittestandcomplement|h|a:*l,b:l||x
_bittestandcomplement64|h|a:*q,b:q||x
_bittestandreset|h|a:*l,b:l||x
_bittestandreset64|h|a:*q,b:q||x
_bittestandset|h|a:*l,b:l||x
_bittestandset64|h|a:*q,b:q||x
_hread|l|hFile:i,lpBuffer:*v,lBytes:l||1
_hwrite|l|hFile:i,lpBuffer:^c,lBytes:l||1
_interlockedbittestandcomplement|h|a:*l,b:l||x
_interlockedbittestandcomplement64|h|a:*q,b:q||x
_interlockedbittestandreset|h|a:*l,b:l||x
_interlockedbittestandreset64|h|a:*q,b:q||x
_interlockedbittestandset|h|a:*l,b:l||x
_interlockedbittestandset64|h|a:*q,b:q||x
_lclose|i|hFile:i||1
_lcreat|i|lpPathName:^c,iAttribute:i||1
_llseek|l|hFile:i,lOffset:l,iOrigin:i||1
_lopen|i|lpPathName:^c,iReadWrite:i||1
_lread|u|hFile:i,lpBuffer:*v,uBytes:u||1
_lwrite|u|hFile:i,lpBuffer:^c,uBytes:u||1
_mul128|q|Multiplier:q,Multiplicand:q,HighProduct:*q||10
_rotl64|r|Value:r,Shift:i||10
_rotr64|r|Value:r,Shift:i||10
_umul128|r|Multiplier:r,Multiplicand:r,HighProduct:*r||10
lstrcatA|*c|lpString1:*c,lpString2:^c||1
lstrcatW|*w|lpString1:*w,lpString2:^w||1
lstrcmpA|i|lpString1:^c,lpString2:^c||1
lstrcmpW|i|lpString1:^w,lpString2:^w||1
lstrcmpiA|i|lpString1:^c,lpString2:^c||1
lstrcmpiW|i|lpString1:^w,lpString2:^w||1
lstrcpyA|*c|lpString1:*c,lpString2:^c||1
lstrcpyW|*w|lpString1:*w,lpString2:^w||1
lstrcpynA|*c|lpString1:*c,lpString2:^c,iMaxLength:i||1
lstrcpynW|*w|lpString1:*w,lpString2:^w,iMaxLength:i||1
lstrlenA|i|lpString:^c||1
lstrlenW|i|lpString:^w||1
uaw_lstrcmpW|i|String1:^w,String2:^w||15
uaw_lstrcmpiW|i|String1:^w,String2:^w||15
uaw_lstrlenW|i|String:^w||15
uaw_wcschr|*w|String:^w,Character:w||15
uaw_wcscpy|*w|Destination:*w,Source:^w||15
uaw_wcsicmp|i|String1:^w,String2:^w||15
uaw_wcslen|z|String:^w||15
uaw_wcsrchr|*w|String:^w,Character:w||15
`;var $r=Object.freeze({__proto__:null,data:Xr,headers:qr,provenance:jr});const Qr="mingw-w64 unknown include",Zr=["shellapi.h","shlobj.h","shobjidl.h"],Jr=`&HANDLE=v
&HDROP=@struct HDROP__;
&HICON=@struct HICON__;
&HIMAGELIST=@struct _IMAGELIST;
&HINSTANCE=@struct HINSTANCE__;
&HKEY=@struct HKEY__;
&HMENU=@struct HMENU__;
&HPSXA=@struct HPSXA__;
&HWND=@struct HWND__;
AssocCreateForClasses|l|rgClasses:^@ASSOCIATIONELEMENT;,cClasses:m,riid:^@GUID;,ppv:**v||0
AssocGetDetailsOfPropKey|l|psf:*@IShellFolder;,pidl:^@ITEMIDLIST;,pkey:^@PROPERTYKEY;,pv:*@VARIANT;,pfFoundPropKey:*i||1
CDefFolderMenu_Create2|l|pidlFolder:^@ITEMIDLIST;,hwnd:&HWND;,cidl:u,apidl:*^@ITEMIDLIST;,psf:*@IShellFolder;,pfn:p,nKeys:u,ahkeys:^&HKEY;,ppcm:**@IContextMenu;||1
CIDLData_CreateFromIDArray|l|pidlFolder:^@ITEMIDLIST;,cidl:u,apidl:*^@ITEMIDLIST;,ppdtobj:**@IDataObject;||1
CommandLineToArgvW|**w|lpCmdLine:^w,pNumArgs:*i||0
DAD_AutoScroll|i|hwnd:&HWND;,pad:*@AUTO_SCROLL_DATA;,pptNow:^@POINT;||1
DAD_DragLeave|i|||1
DAD_SetDragImage|i|him:&HIMAGELIST;,pptOffset:*@POINT;||1
DAD_ShowDragImage|i|fShow:i||1
DoEnvironmentSubstA|m|pszSrc:*c,cchSrc:u||0
DoEnvironmentSubstW|m|pszSrc:*w,cchSrc:u||0
DragAcceptFiles|v|hWnd:&HWND;,fAccept:i||0
DragFinish|v|hDrop:&HDROP;||0
DragQueryFileA|u|hDrop:&HDROP;,iFile:u,lpszFile:*c,cch:u||0
DragQueryFileW|u|hDrop:&HDROP;,iFile:u,lpszFile:*w,cch:u||0
DragQueryPoint|i|hDrop:&HDROP;,ppt:*@POINT;||0
DriveType|i|iDrive:i||1
DuplicateIcon|&HICON;|hInst:&HINSTANCE;,hIcon:&HICON;||0
ExtractAssociatedIconA|&HICON;|hInst:&HINSTANCE;,pszIconPath:*c,piIcon:*t||0
ExtractAssociatedIconExA|&HICON;|hInst:&HINSTANCE;,pszIconPath:*c,piIconIndex:*t,piIconId:*t||0
ExtractAssociatedIconExW|&HICON;|hInst:&HINSTANCE;,pszIconPath:*w,piIconIndex:*t,piIconId:*t||0
ExtractAssociatedIconW|&HICON;|hInst:&HINSTANCE;,pszIconPath:*w,piIcon:*t||0
ExtractIconA|&HICON;|hInst:&HINSTANCE;,pszExeFileName:^c,nIconIndex:u||0
ExtractIconExA|u|lpszFile:^c,nIconIndex:i,phiconLarge:*&HICON;,phiconSmall:*&HICON;,nIcons:u||0
ExtractIconExW|u|lpszFile:^w,nIconIndex:i,phiconLarge:*&HICON;,phiconSmall:*&HICON;,nIcons:u||0
ExtractIconW|&HICON;|hInst:&HINSTANCE;,pszExeFileName:^w,nIconIndex:u||0
FindExecutableA|&HINSTANCE;|lpFile:^c,lpDirectory:^c,lpResult:*c||0
FindExecutableW|&HINSTANCE;|lpFile:^w,lpDirectory:^w,lpResult:*w||0
GetCurrentProcessExplicitAppUserModelID|l|AppID:**w||2
GetFileNameFromBrowse|i|hwnd:&HWND;,pszFilePath:*w,cchFilePath:u,pszWorkingDir:^w,pszDefExt:^w,pszFilters:^w,pszTitle:^w||1
ILAppendID|*@ITEMIDLIST;|pidl:*@ITEMIDLIST;,pmkid:^@SHITEMID;,fAppend:i||1
ILClone|*@ITEMIDLIST;|pidl:^@ITEMIDLIST;||1
ILCloneFirst|*@ITEMIDLIST;|pidl:^@ITEMIDLIST;||1
ILCombine|*@ITEMIDLIST;|pidl1:^@ITEMIDLIST;,pidl2:^@ITEMIDLIST;||1
ILCreateFromPathA|*@ITEMIDLIST;|pszPath:^c||1
ILCreateFromPathW|*@ITEMIDLIST;|pszPath:^w||1
ILFindChild|*@ITEMIDLIST;|pidlParent:*@ITEMIDLIST;,pidlChild:^@ITEMIDLIST;||1
ILFindLastID|*@ITEMIDLIST;|pidl:^@ITEMIDLIST;||1
ILFree|v|pidl:*@ITEMIDLIST;||1
ILGetNext|*@ITEMIDLIST;|pidl:^@ITEMIDLIST;||1
ILGetSize|u|pidl:^@ITEMIDLIST;||1
ILIsEqual|i|pidl1:^@ITEMIDLIST;,pidl2:^@ITEMIDLIST;||1
ILIsParent|i|pidl1:^@ITEMIDLIST;,pidl2:^@ITEMIDLIST;,fImmediate:i||1
ILLoadFromStream|l|pstm:*@IStream;,pidl:**@ITEMIDLIST;||1
ILLoadFromStreamEx|l|pstm:*@IStream;,pidl:**@ITEMIDLIST;||1
ILRemoveLastID|i|pidl:*@ITEMIDLIST;||1
ILSaveToStream|l|pstm:*@IStream;,pidl:^@ITEMIDLIST;||1
InitNetworkAddressControl|i|||0
IsLFNDriveA|i|pszPath:^c||0
IsLFNDriveW|i|pszPath:^w||0
IsNetDrive|i|iDrive:i||1
IsUserAnAdmin|i|||1
OpenRegStream|*@IStream;|hkey:&HKEY;,pszSubkey:^w,pszValue:^w,grfMode:m||1
PathCleanupSpec|i|pszDir:^w,pszSpec:*w||1
PathGetShortPath|v|pszLongPath:*w||1
PathIsExe|i|pszPath:^w||1
PathIsSlowA|i|pszFile:^c,dwAttr:m||1
PathIsSlowW|i|pszFile:^w,dwAttr:m||1
PathMakeUniqueName|i|pszUniqueName:*w,cchMax:u,pszTemplate:^w,pszLongPlate:^w,pszDir:^w||1
PathQualify|v|psz:*w||1
PathResolve|i|pszPath:*w,dirs:*^w,fFlags:u||1
PathYetAnotherMakeUniqueName|i|pszUniqueName:*w,pszPath:^w,pszShort:^w,pszFileSpec:^w||1
PickIconDlg|i|hwnd:&HWND;,pszIconPath:*w,cchIconPath:u,piIconIndex:*i||1
PifMgr_CloseProperties|&HANDLE;|hProps:&HANDLE;,flOpt:u||1
PifMgr_GetProperties|i|hProps:&HANDLE;,pszGroup:^c,lpProps:*v,cbProps:i,flOpt:u||1
PifMgr_OpenProperties|&HANDLE;|pszApp:^w,pszPIF:^w,hInf:u,flOpt:u||1
PifMgr_SetProperties|i|hProps:&HANDLE;,pszGroup:^c,lpProps:^v,cbProps:i,flOpt:u||1
ReadCabinetState|i|pcs:*@CABINETSTATE;,cLength:i||1
RealDriveType|i|iDrive:i,fOKToHitNet:i||1
RestartDialog|i|hwnd:&HWND;,pszPrompt:^w,dwReturn:m||1
RestartDialogEx|i|hwnd:&HWND;,pszPrompt:^w,dwReturn:m,dwReasonCode:m||1
SHAddDefaultPropertiesByExt|l|pszExt:^w,pPropStore:*@IPropertyStore;||2
SHAddFromPropSheetExtArray|u|hpsxa:&HPSXA;,lpfnAddPage:p,lParam:q||1
SHAddToRecentDocs|v|uFlags:u,pv:^v||1
SHAlloc|*v|cb:z||1
SHAppBarMessage|r|dwMessage:m,pData:*@struct _AppBarData;||0
SHAssocEnumHandlers|l|pszExtra:^w,afFilter:u,ppEnumHandler:**@IEnumAssocHandlers;||2
SHAssocEnumHandlersForProtocolByApplication|l|protocol:^w,riid:^@GUID;,enumHandlers:**v||2
SHBindToFolderIDListParent|l|psfRoot:*@IShellFolder;,pidl:^@ITEMIDLIST;,riid:^@GUID;,ppv:**v,ppidlLast:*^@ITEMIDLIST;||1
SHBindToFolderIDListParentEx|l|psfRoot:*@IShellFolder;,pidl:^@ITEMIDLIST;,ppbc:*@IBindCtx;,riid:^@GUID;,ppv:**v,ppidlLast:*^@ITEMIDLIST;||1
SHBindToObject|l|psf:*@IShellFolder;,pidl:^@ITEMIDLIST;,pbc:*@IBindCtx;,riid:^@GUID;,ppv:**v||1
SHBindToParent|l|pidl:^@ITEMIDLIST;,riid:^@GUID;,ppv:**v,ppidlLast:*^@ITEMIDLIST;||1
SHBrowseForFolderA|*@ITEMIDLIST;|lpbi:*@struct _browseinfoA;||1
SHBrowseForFolderW|*@ITEMIDLIST;|lpbi:*@struct _browseinfoW;||1
SHCLSIDFromString|l|psz:^w,pclsid:*@GUID;||1
SHChangeNotification_Lock|&HANDLE;|hChange:&HANDLE;,dwProcId:m,pppidl:***@ITEMIDLIST;,plEvent:*l||1
SHChangeNotification_Unlock|i|hLock:&HANDLE;||1
SHChangeNotify|v|wEventId:l,uFlags:u,dwItem1:^v,dwItem2:^v||1
SHChangeNotifyDeregister|i|ulID:m||1
SHChangeNotifyRegister|m|hwnd:&HWND;,fSources:i,fEvents:l,wMsg:u,cEntries:i,pshcne:^@SHChangeNotifyEntry;||1
SHCloneSpecialIDList|*@ITEMIDLIST;|hwnd:&HWND;,csidl:i,fCreate:i||1
SHCoCreateInstance|l|pszCLSID:^w,pclsid:^@GUID;,pUnkOuter:*@IUnknown;,riid:^@GUID;,ppv:**v||1
SHCreateAssociationRegistration|l|riid:^@GUID;,ppv:**v||2
SHCreateDataObject|l|pidlFolder:^@ITEMIDLIST;,cidl:u,apidl:*^@ITEMIDLIST;,pdtInner:*@IDataObject;,riid:^@GUID;,ppv:**v||1
SHCreateDefaultContextMenu|l|pdcm:^@DEFCONTEXTMENU;,riid:^@GUID;,ppv:**v||1
SHCreateDefaultExtractIcon|l|riid:^@GUID;,ppv:**v||2
SHCreateDefaultPropertiesOp|l|psi:*@IShellItem;,ppFileOp:**@IFileOperation;||2
SHCreateDirectory|i|hwnd:&HWND;,pszPath:^w||1
SHCreateDirectoryExA|i|hwnd:&HWND;,pszPath:^c,psa:^@SECURITY_ATTRIBUTES;||1
SHCreateDirectoryExW|i|hwnd:&HWND;,pszPath:^w,psa:^@SECURITY_ATTRIBUTES;||1
SHCreateFileExtractIconW|l|pszFile:^w,dwFileAttributes:m,riid:^@GUID;,ppv:**v||1
SHCreateItemFromIDList|l|pidl:^@ITEMIDLIST;,riid:^@GUID;,ppv:**v||2
SHCreateItemFromParsingName|l|pszPath:^w,pbc:*@IBindCtx;,riid:^@GUID;,ppv:**v||2
SHCreateItemFromRelativeName|l|psiParent:*@IShellItem;,pszName:^w,pbc:*@IBindCtx;,riid:^@GUID;,ppv:**v||2
SHCreateItemInKnownFolder|l|kfid:^@GUID;,dwKFFlags:m,pszItem:^w,riid:^@GUID;,ppv:**v||2
SHCreateItemWithParent|l|pidlParent:^@ITEMIDLIST;,psfParent:*@IShellFolder;,pidl:^@ITEMIDLIST;,riid:^@GUID;,ppvItem:**v||2
SHCreateProcessAsUserW|i|pscpi:*@struct _SHCREATEPROCESSINFOW;||0
SHCreatePropSheetExtArray|&HPSXA;|hKey:&HKEY;,pszSubKey:^w,max_iface:u||1
SHCreateQueryCancelAutoPlayMoniker|l|ppmoniker:**@IMoniker;||1
SHCreateShellFolderView|l|pcsfv:^@SFV_CREATE;,ppsv:**@IShellView;||1
SHCreateShellFolderViewEx|l|pcsfv:*@CSFV;,ppsv:**@IShellView;||1
SHCreateShellItem|l|pidlParent:^@ITEMIDLIST;,psfParent:*@IShellFolder;,pidl:^@ITEMIDLIST;,ppsi:**@IShellItem;||1
SHCreateShellItemArray|l|pidlParent:^@ITEMIDLIST;,psf:*@IShellFolder;,cidl:u,ppidl:*^@ITEMIDLIST;,ppsiItemArray:**@IShellItemArray;||2
SHCreateShellItemArrayFromDataObject|l|pdo:*@IDataObject;,riid:^@GUID;,ppv:**v||2
SHCreateShellItemArrayFromIDLists|l|cidl:u,rgpidl:*^@ITEMIDLIST;,ppsiItemArray:**@IShellItemArray;||2
SHCreateShellItemArrayFromShellItem|l|psi:*@IShellItem;,riid:^@GUID;,ppv:**v||2
SHCreateStdEnumFmtEtc|l|cfmt:u,afmt:^@FORMATETC;,ppenumFormatEtc:**@IEnumFORMATETC;||1
SHDefExtractIconA|l|pszIconFile:^c,iIndex:i,uFlags:u,phiconLarge:*&HICON;,phiconSmall:*&HICON;,nIconSize:u||1
SHDefExtractIconW|l|pszIconFile:^w,iIndex:i,uFlags:u,phiconLarge:*&HICON;,phiconSmall:*&HICON;,nIconSize:u||1
SHDestroyPropSheetExtArray|v|hpsxa:&HPSXA;||1
SHDoDragDrop|l|hwnd:&HWND;,pdata:*@IDataObject;,pdsrc:*@IDropSource;,dwEffect:m,pdwEffect:*m||1
SHEmptyRecycleBinA|l|hwnd:&HWND;,pszRootPath:^c,dwFlags:m||0
SHEmptyRecycleBinW|l|hwnd:&HWND;,pszRootPath:^w,dwFlags:m||0
SHEnumerateUnreadMailAccountsW|l|hKeyUser:&HKEY;,dwIndex:m,pszMailAddress:*w,cchMailAddress:i||0
SHEvaluateSystemCommandTemplate|l|pszCmdTemplate:^w,ppszApplication:**w,ppszCommandLine:**w,ppszParameters:**w||0
SHFileOperationA|i|lpFileOp:*@struct _SHFILEOPSTRUCTA;||0
SHFileOperationW|i|lpFileOp:*@struct _SHFILEOPSTRUCTW;||0
SHFindFiles|i|pidlFolder:^@ITEMIDLIST;,pidlSaveFile:^@ITEMIDLIST;||1
SHFind_InitMenuPopup|*@IContextMenu;|hmenu:&HMENU;,hwndOwner:&HWND;,idCmdFirst:u,idCmdLast:u||1
SHFlushSFCache|v|||1
SHFormatDrive|m|hwnd:&HWND;,drive:u,fmtID:u,options:u||1
SHFree|v|pv:*v||1
SHFreeNameMappings|v|hNameMappings:&HANDLE;||0
SHGetAttributesFromDataObject|l|pdo:*@IDataObject;,dwAttributeMask:m,pdwAttributes:*m,pcItems:*u||1
SHGetDataFromIDListA|l|psf:*@IShellFolder;,pidl:^@ITEMIDLIST;,nFormat:i,pv:*v,cb:i||1
SHGetDataFromIDListW|l|psf:*@IShellFolder;,pidl:^@ITEMIDLIST;,nFormat:i,pv:*v,cb:i||1
SHGetDesktopFolder|l|ppshf:**@IShellFolder;||1
SHGetDiskFreeSpaceExA|i|pszDirectoryName:^c,pulFreeBytesAvailableToCaller:*@ULARGE_INTEGER;,pulTotalNumberOfBytes:*@ULARGE_INTEGER;,pulTotalNumberOfFreeBytes:*@ULARGE_INTEGER;||0
SHGetDiskFreeSpaceExW|i|pszDirectoryName:^w,pulFreeBytesAvailableToCaller:*@ULARGE_INTEGER;,pulTotalNumberOfBytes:*@ULARGE_INTEGER;,pulTotalNumberOfFreeBytes:*@ULARGE_INTEGER;||0
SHGetDriveMedia|l|pszDrive:^w,pdwMediaContent:*m||0
SHGetFileInfoA|r|pszPath:^c,dwFileAttributes:m,psfi:*@SHFILEINFOA;,cbFileInfo:u,uFlags:u||0
SHGetFileInfoW|r|pszPath:^w,dwFileAttributes:m,psfi:*@SHFILEINFOW;,cbFileInfo:u,uFlags:u||0
SHGetFolderLocation|l|hwnd:&HWND;,csidl:i,hToken:&HANDLE;,dwFlags:m,ppidl:**@ITEMIDLIST;||1
SHGetFolderPathA|l|hwnd:&HWND;,csidl:i,hToken:&HANDLE;,dwFlags:m,pszPath:*c||1
SHGetFolderPathAndSubDirA|l|hwnd:&HWND;,csidl:i,hToken:&HANDLE;,dwFlags:m,pszSubDir:^c,pszPath:*c||1
SHGetFolderPathAndSubDirW|l|hwnd:&HWND;,csidl:i,hToken:&HANDLE;,dwFlags:m,pszSubDir:^w,pszPath:*w||1
SHGetFolderPathW|l|hwnd:&HWND;,csidl:i,hToken:&HANDLE;,dwFlags:m,pszPath:*w||1
SHGetIDListFromObject|l|punk:*@IUnknown;,ppidl:**@ITEMIDLIST;||2
SHGetIconOverlayIndexA|i|pszIconPath:^c,iIconIndex:i||1
SHGetIconOverlayIndexW|i|pszIconPath:^w,iIconIndex:i||1
SHGetImageList|l|iImageList:i,riid:^@GUID;,ppvObj:**v||0
SHGetInstanceExplorer|l|ppunk:**@IUnknown;||1
SHGetItemFromDataObject|l|pdtobj:*@IDataObject;,dwFlags:u,riid:^@GUID;,ppv:**v||2
SHGetItemFromObject|l|punk:*@IUnknown;,riid:^@GUID;,ppv:**v||2
SHGetKnownFolderIDList|l|rfid:^@GUID;,dwFlags:m,hToken:&HANDLE;,ppidl:**@ITEMIDLIST;||1
SHGetKnownFolderPath|l|rfid:^@GUID;,dwFlags:m,hToken:&HANDLE;,ppszPath:**w||1
SHGetLocalizedName|l|pszPath:^w,pszResModule:*w,cch:u,pidsRes:*i||0
SHGetMalloc|l|ppMalloc:**@IMalloc;||1
SHGetNameFromIDList|l|pidl:^@ITEMIDLIST;,sigdnName:i,ppszName:**w||2
SHGetNewLinkInfoA|i|pszLinkTo:^c,pszDir:^c,pszName:*c,pfMustCopy:*i,uFlags:u||0
SHGetNewLinkInfoW|i|pszLinkTo:^w,pszDir:^w,pszName:*w,pfMustCopy:*i,uFlags:u||0
SHGetPathFromIDListA|i|pidl:^@ITEMIDLIST;,pszPath:*c||1
SHGetPathFromIDListEx|i|pidl:^@ITEMIDLIST;,pszPath:*w,cchPath:m,uOpts:i||1
SHGetPathFromIDListW|i|pidl:^@ITEMIDLIST;,pszPath:*w||1
SHGetPropertyStoreForWindow|l|hwnd:&HWND;,riid:^@GUID;,ppv:**v||0
SHGetPropertyStoreFromIDList|l|pidl:^@ITEMIDLIST;,flags:u,riid:^@GUID;,ppv:**v||2
SHGetPropertyStoreFromParsingName|l|pszPath:^w,pbc:*@IBindCtx;,flags:u,riid:^@GUID;,ppv:**v||2
SHGetRealIDL|l|psf:*@IShellFolder;,pidlSimple:^@ITEMIDLIST;,ppidlReal:**@ITEMIDLIST;||1
SHGetSetFolderCustomSettings|l|pfcs:*@struct SHFOLDERCUSTOMSETTINGS;,pszPath:^w,dwReadWrite:m||1
SHGetSetSettings|v|lpss:*@struct SHELLSTATEA;,dwMask:m,bSet:i||1
SHGetSettings|v|psfs:*@SHELLFLAGSTATE;,dwMask:m||1
SHGetSpecialFolderLocation|l|hwnd:&HWND;,csidl:i,ppidl:**@ITEMIDLIST;||1
SHGetSpecialFolderPathA|i|hwnd:&HWND;,pszPath:*c,csidl:i,fCreate:i||1
SHGetSpecialFolderPathW|i|hwnd:&HWND;,pszPath:*w,csidl:i,fCreate:i||1
SHGetStockIconInfo|l|siid:u,uFlags:u,psii:*@SHSTOCKICONINFO;||0
SHGetTemporaryPropertyForItem|l|psi:*@IShellItem;,propkey:^@PROPERTYKEY;,ppropvar:*@PROPVARIANT;||2
SHGetUnreadMailCountW|l|hKeyUser:&HKEY;,pszMailAddress:^w,pdwCount:*m,pFileTime:*@FILETIME;,pszShellExecuteCommand:*w,cchShellExecuteCommand:i||0
SHHandleUpdateImage|i|pidlExtra:^@ITEMIDLIST;||1
SHILCreateFromPath|l|pszPath:^w,ppidl:**@ITEMIDLIST;,rgfInOut:*m||1
SHInvokePrinterCommandA|i|hwnd:&HWND;,uAction:u,lpBuf1:^c,lpBuf2:^c,fModal:i||0
SHInvokePrinterCommandW|i|hwnd:&HWND;,uAction:u,lpBuf1:^w,lpBuf2:^w,fModal:i||0
SHIsFileAvailableOffline|l|pwszPath:^w,pdwStatus:*m||0
SHLimitInputEdit|l|hwndEdit:&HWND;,psf:*@IShellFolder;||1
SHLoadInProc|l|rclsid:^@GUID;||1
SHLoadNonloadedIconOverlayIdentifiers|l|||0
SHMapPIDLToSystemImageListIndex|i|pshf:*@IShellFolder;,pidl:^@ITEMIDLIST;,piIndexSel:*i||1
SHMultiFileProperties|l|pdtobj:*@IDataObject;,dwFlags:m||1
SHObjectProperties|i|hwnd:&HWND;,shopObjectType:m,pszObjectName:^w,pszPropertyPage:^w||1
SHOpenFolderAndSelectItems|l|pidlFolder:^@ITEMIDLIST;,cidl:u,apidl:*^@ITEMIDLIST;,dwFlags:m||1
SHOpenPropSheetW|i|pszCaption:^w,ahkeys:*&HKEY;,ckeys:u,pclsidDefault:^@GUID;,pdtobj:*@IDataObject;,psb:*@IShellBrowser;,pStartPage:^w||1
SHOpenWithDialog|l|hwndParent:&HWND;,poainfo:^@OPENASINFO;||1
SHParseDisplayName|l|pszName:^w,pbc:*@IBindCtx;,ppidl:**@ITEMIDLIST;,sfgaoIn:m,psfgaoOut:*m||1
SHPathPrepareForWriteA|l|hwnd:&HWND;,punkEnableModless:*@IUnknown;,pszPath:^c,dwFlags:m||1
SHPathPrepareForWriteW|l|hwnd:&HWND;,punkEnableModless:*@IUnknown;,pszPath:^w,dwFlags:m||1
SHPropStgCreate|l|psstg:*@IPropertySetStorage;,fmtid:^@GUID;,pclsid:^@GUID;,grfFlags:m,grfMode:m,dwDisposition:m,ppstg:**@IPropertyStorage;,puCodePage:*u||1
SHPropStgReadMultiple|l|pps:*@IPropertyStorage;,uCodePage:u,cpspec:m,rgpspec:^@PROPSPEC;,rgvar:*@PROPVARIANT;||1
SHPropStgWriteMultiple|l|pps:*@IPropertyStorage;,puCodePage:*u,cpspec:m,rgpspec:^@PROPSPEC;,rgvar:*@PROPVARIANT;,propidNameFirst:m||1
SHQueryRecycleBinA|l|pszRootPath:^c,pSHQueryRBInfo:*@struct _SHQUERYRBINFO;||0
SHQueryRecycleBinW|l|pszRootPath:^w,pSHQueryRBInfo:*@struct _SHQUERYRBINFO;||0
SHRemoveLocalizedName|l|pszPath:^w||0
SHReplaceFromPropSheetExtArray|u|hpsxa:&HPSXA;,uPageID:u,lpfnReplaceWith:p,lParam:q||1
SHResolveLibrary|l|psiLibrary:*@IShellItem;||2
SHRestricted|m|rest:u||1
SHRunControlPanel|i|lpcszCmdLine:^w,hwndMsgParent:&HWND;||1
SHSetDefaultProperties|l|hwnd:&HWND;,psi:*@IShellItem;,dwFileOpFlags:m,pfops:*@IFileOperationProgressSink;||2
SHSetFolderPathA|l|csidl:i,hToken:&HANDLE;,dwFlags:m,pszPath:^c||1
SHSetFolderPathW|l|csidl:i,hToken:&HANDLE;,dwFlags:m,pszPath:^w||1
SHSetInstanceExplorer|v|punk:*@IUnknown;||1
SHSetKnownFolderPath|l|rfid:^@GUID;,dwFlags:m,hToken:&HANDLE;,pszPath:^w||1
SHSetLocalizedName|l|pszPath:^w,pszResModule:^w,idsRes:i||0
SHSetTemporaryPropertyForItem|l|psi:*@IShellItem;,propkey:^@PROPERTYKEY;,propvar:^@PROPVARIANT;||2
SHSetUnreadMailCountW|l|pszMailAddress:^w,dwCount:m,pszShellExecuteCommand:^w||0
SHShellFolderView_Message|q|hwndMain:&HWND;,uMsg:u,lParam:q||1
SHShowManageLibraryUI|l|psiLibrary:*@IShellItem;,hwndOwner:&HWND;,pszTitle:^w,pszInstruction:^w,lmdOptions:u||2
SHSimpleIDListFromPath|*@ITEMIDLIST;|pszPath:^w||2
SHStartNetConnectionDialogW|l|hwnd:&HWND;,pszRemoteName:^w,dwType:m||1
SHTestTokenMembership|i|hToken:&HANDLE;,ulRID:m||0
SHUpdateImageA|v|pszHashItem:^c,iIndex:i,uFlags:u,iImageIndex:i||1
SHUpdateImageW|v|pszHashItem:^w,iIndex:i,uFlags:u,iImageIndex:i||1
SHValidateUNC|i|hwndOwner:&HWND;,pszFile:*w,fConnect:u||1
SetCurrentProcessExplicitAppUserModelID|l|AppID:^w||2
ShellAboutA|i|hWnd:&HWND;,szApp:^c,szOtherStuff:^c,hIcon:&HICON;||0
ShellAboutW|i|hWnd:&HWND;,szApp:^w,szOtherStuff:^w,hIcon:&HICON;||0
ShellExecuteA|&HINSTANCE;|hwnd:&HWND;,lpOperation:^c,lpFile:^c,lpParameters:^c,lpDirectory:^c,nShowCmd:i||0
ShellExecuteExA|i|pExecInfo:*@SHELLEXECUTEINFOA;||0
ShellExecuteExW|i|pExecInfo:*@SHELLEXECUTEINFOW;||0
ShellExecuteW|&HINSTANCE;|hwnd:&HWND;,lpOperation:^w,lpFile:^w,lpParameters:^w,lpDirectory:^w,nShowCmd:i||0
ShellMessageBoxA|i|hAppInst:&HINSTANCE;,hWnd:&HWND;,lpcText:^c,lpcTitle:^c,fuStyle:u|v|0
ShellMessageBoxW|i|hAppInst:&HINSTANCE;,hWnd:&HWND;,lpcText:^w,lpcTitle:^w,fuStyle:u|v|0
Shell_GetCachedImageIndex|i|pwszIconPath:^w,iIconIndex:i,uIconFlags:u||1
Shell_GetCachedImageIndexA|i|pszIconPath:^c,iIconIndex:i,uIconFlags:u||1
Shell_GetCachedImageIndexW|i|pszIconPath:^w,iIconIndex:i,uIconFlags:u||1
Shell_GetImageLists|i|phiml:*&HIMAGELIST;,phimlSmall:*&HIMAGELIST;||1
Shell_MergeMenus|u|hmDst:&HMENU;,hmSrc:&HMENU;,uInsert:u,uIDAdjust:u,uIDAdjustMax:u,uFlags:m||1
Shell_NotifyIconA|i|dwMessage:m,lpData:*@struct _NOTIFYICONDATAA;||0
Shell_NotifyIconGetRect|l|identifier:^@NOTIFYICONIDENTIFIER;,iconLocation:*@RECT;||0
Shell_NotifyIconW|i|dwMessage:m,lpData:*@struct _NOTIFYICONDATAW;||0
SignalFileOpen|i|pidl:^@ITEMIDLIST;||1
StgMakeUniqueName|l|pstgParent:*@IStorage;,pszFileSpec:^w,grfMode:m,riid:^@GUID;,ppv:**v||1
Win32DeleteFile|i|pszPath:^w||1
WriteCabinetState|i|pcs:*@CABINETSTATE;||1
`;var ea=Object.freeze({__proto__:null,data:Jr,headers:Zr,provenance:Qr});const ta="mingw-w64 unknown include",ia=["winuser.h","libloaderapi.h"],ra=`&HACCEL=@struct HACCEL__;
&HANDLE=v
&HBITMAP=@struct HBITMAP__;
&HBRUSH=@struct HBRUSH__;
&HDC=@struct HDC__;
&HDESK=@struct HDESK__;
&HGESTUREINFO=@struct HGESTUREINFO__;
&HHOOK=@struct HHOOK__;
&HICON=@struct HICON__;
&HINSTANCE=@struct HINSTANCE__;
&HKL=@struct HKL__;
&HMENU=@struct HMENU__;
&HMONITOR=@struct HMONITOR__;
&HRAWINPUT=@struct HRAWINPUT__;
&HRGN=@struct HRGN__;
&HSYNTHETICPOINTERDEVICE=@struct HSYNTHETICPOINTERDEVICE__;
&HTOUCHINPUT=@struct HTOUCHINPUT__;
&HWINEVENTHOOK=@struct HWINEVENTHOOK__;
&HWINSTA=@struct HWINSTA__;
&HWND=@struct HWND__;
ActivateKeyboardLayout|&HKL;|hkl:&HKL;,Flags:u||0
AddClipboardFormatListener|i|hwnd:&HWND;||0
AdjustWindowRect|i|lpRect:*@struct tagRECT;,dwStyle:m,bMenu:i||0
AdjustWindowRectEx|i|lpRect:*@struct tagRECT;,dwStyle:m,bMenu:i,dwExStyle:m||0
AdjustWindowRectExForDpi|i|lpRect:*@struct tagRECT;,dwStyle:m,bMenu:i,dwExStyle:m,dpi:u||0
AllowSetForegroundWindow|i|dwProcessId:m||0
AnimateWindow|i|hWnd:&HWND;,dwTime:m,dwFlags:m||0
AnyPopup|i|||0
AppendMenuA|i|hMenu:&HMENU;,uFlags:u,uIDNewItem:r,lpNewItem:^c||0
AppendMenuW|i|hMenu:&HMENU;,uFlags:u,uIDNewItem:r,lpNewItem:^w||0
AreDpiAwarenessContextsEqual|i|dpiContextA:*@struct DPI_AWARENESS_CONTEXT__;,dpiContextB:*@struct DPI_AWARENESS_CONTEXT__;||0
ArrangeIconicWindows|u|hWnd:&HWND;||0
AttachThreadInput|i|idAttach:m,idAttachTo:m,fAttach:i||0
BeginDeferWindowPos|&HANDLE;|nNumWindows:i||0
BeginPaint|&HDC;|hWnd:&HWND;,lpPaint:*@struct tagPAINTSTRUCT;||0
BlockInput|i|fBlockIt:i||0
BringWindowToTop|i|hWnd:&HWND;||0
BroadcastSystemMessageA|l|flags:m,lpInfo:*m,Msg:u,wParam:r,lParam:q||0
BroadcastSystemMessageExA|l|flags:m,lpInfo:*m,Msg:u,wParam:r,lParam:q,pbsmInfo:*@struct BSMINFO;||0
BroadcastSystemMessageExW|l|flags:m,lpInfo:*m,Msg:u,wParam:r,lParam:q,pbsmInfo:*@struct BSMINFO;||0
BroadcastSystemMessageW|l|flags:m,lpInfo:*m,Msg:u,wParam:r,lParam:q||0
CalculatePopupWindowPosition|i|anchorPoint:^@POINT;,windowSize:^@SIZE;,flags:u,excludeRect:*@RECT;,popupWindowPosition:*@RECT;||0
CallMsgFilterA|i|lpMsg:*@struct tagMSG;,nCode:i||0
CallMsgFilterW|i|lpMsg:*@struct tagMSG;,nCode:i||0
CallNextHookEx|q|hhk:&HHOOK;,nCode:i,wParam:r,lParam:q||0
CallWindowProcA|q|lpPrevWndFunc:p,hWnd:&HWND;,Msg:u,wParam:r,lParam:q||0
CallWindowProcW|q|lpPrevWndFunc:p,hWnd:&HWND;,Msg:u,wParam:r,lParam:q||0
CancelShutdown|i|||0
CascadeWindows|t|hwndParent:&HWND;,wHow:u,lpRect:^@RECT;,cKids:u,lpKids:^&HWND;||0
ChangeClipboardChain|i|hWndRemove:&HWND;,hWndNewNext:&HWND;||0
ChangeDisplaySettingsA|l|lpDevMode:*@struct _devicemodeA;,dwFlags:m||0
ChangeDisplaySettingsExA|l|lpszDeviceName:^c,lpDevMode:*@struct _devicemodeA;,hwnd:&HWND;,dwflags:m,lParam:*v||0
ChangeDisplaySettingsExW|l|lpszDeviceName:^w,lpDevMode:*@struct _devicemodeW;,hwnd:&HWND;,dwflags:m,lParam:*v||0
ChangeDisplaySettingsW|l|lpDevMode:*@struct _devicemodeW;,dwFlags:m||0
ChangeMenuA|i|hMenu:&HMENU;,cmd:u,lpszNewItem:^c,cmdInsert:u,flags:u||0
ChangeMenuW|i|hMenu:&HMENU;,cmd:u,lpszNewItem:^w,cmdInsert:u,flags:u||0
ChangeWindowMessageFilter|i|message:u,dwFlag:m||0
ChangeWindowMessageFilterEx|i|hwnd:&HWND;,message:u,action:m,pChangeFilterStruct:*@struct tagCHANGEFILTERSTRUCT;||0
CharLowerA|*c|lpsz:*c||0
CharLowerBuffA|m|lpsz:*c,cchLength:m||0
CharLowerBuffW|m|lpsz:*w,cchLength:m||0
CharLowerW|*w|lpsz:*w||0
CharNextA|*c|lpsz:^c||0
CharNextExA|*c|CodePage:t,lpCurrentChar:^c,dwFlags:m||0
CharNextW|*w|lpsz:^w||0
CharPrevA|*c|lpszStart:^c,lpszCurrent:^c||0
CharPrevExA|*c|CodePage:t,lpStart:^c,lpCurrentChar:^c,dwFlags:m||0
CharPrevW|*w|lpszStart:^w,lpszCurrent:^w||0
CharToOemA|i|lpszSrc:^c,lpszDst:*c||0
CharToOemBuffA|i|lpszSrc:^c,lpszDst:*c,cchDstLength:m||0
CharToOemBuffW|i|lpszSrc:^w,lpszDst:*c,cchDstLength:m||0
CharToOemW|i|lpszSrc:^w,lpszDst:*c||0
CharUpperA|*c|lpsz:*c||0
CharUpperBuffA|m|lpsz:*c,cchLength:m||0
CharUpperBuffW|m|lpsz:*w,cchLength:m||0
CharUpperW|*w|lpsz:*w||0
CheckDlgButton|i|hDlg:&HWND;,nIDButton:i,uCheck:u||0
CheckMenuItem|m|hMenu:&HMENU;,uIDCheckItem:u,uCheck:u||0
CheckMenuRadioItem|i|hmenu:&HMENU;,first:u,last:u,check:u,flags:u||0
CheckRadioButton|i|hDlg:&HWND;,nIDFirstButton:i,nIDLastButton:i,nIDCheckButton:i||0
ClientToScreen|i|hWnd:&HWND;,lpPoint:*@struct tagPOINT;||0
ClipCursor|i|lpRect:^@RECT;||0
CloseClipboard|i|||0
CloseDesktop|i|hDesktop:&HDESK;||0
CloseGestureInfoHandle|i|hGestureInfo:&HGESTUREINFO;||0
CloseTouchInputHandle|i|hTouchInput:&HTOUCHINPUT;||0
CloseWindow|i|hWnd:&HWND;||0
CloseWindowStation|i|hWinSta:&HWINSTA;||0
CopyAcceleratorTableA|i|hAccelSrc:&HACCEL;,lpAccelDst:*@struct tagACCEL;,cAccelEntries:i||0
CopyAcceleratorTableW|i|hAccelSrc:&HACCEL;,lpAccelDst:*@struct tagACCEL;,cAccelEntries:i||0
CopyIcon|&HICON;|hIcon:&HICON;||0
CopyImage|&HANDLE;|h:&HANDLE;,type:u,cx:i,cy:i,flags:u||0
CopyRect|i|lprcDst:*@struct tagRECT;,lprcSrc:^@RECT;||0
CountClipboardFormats|i|||0
CreateAcceleratorTableA|&HACCEL;|paccel:*@struct tagACCEL;,cAccel:i||0
CreateAcceleratorTableW|&HACCEL;|paccel:*@struct tagACCEL;,cAccel:i||0
CreateCaret|i|hWnd:&HWND;,hBitmap:&HBITMAP;,nWidth:i,nHeight:i||0
CreateCursor|&HICON;|hInst:&HINSTANCE;,xHotSpot:i,yHotSpot:i,nWidth:i,nHeight:i,pvANDPlane:^v,pvXORPlane:^v||0
CreateDesktopA|&HDESK;|lpszDesktop:^c,lpszDevice:^c,pDevmode:*@struct _devicemodeA;,dwFlags:m,dwDesiredAccess:m,lpsa:*@struct _SECURITY_ATTRIBUTES;||0
CreateDesktopExA|&HDESK;|lpszDesktop:^c,lpszDevice:^c,pDevmode:*@DEVMODEA;,dwFlags:m,dwDesiredAccess:m,lpsa:*@struct _SECURITY_ATTRIBUTES;,ulHeapSize:m,pvoid:*v||0
CreateDesktopExW|&HDESK;|lpszDesktop:^w,lpszDevice:^w,pDevmode:*@DEVMODEW;,dwFlags:m,dwDesiredAccess:m,lpsa:*@struct _SECURITY_ATTRIBUTES;,ulHeapSize:m,pvoid:*v||0
CreateDesktopW|&HDESK;|lpszDesktop:^w,lpszDevice:^w,pDevmode:*@struct _devicemodeW;,dwFlags:m,dwDesiredAccess:m,lpsa:*@struct _SECURITY_ATTRIBUTES;||0
CreateDialogIndirectParamA|&HWND;|hInstance:&HINSTANCE;,lpTemplate:^@DLGTEMPLATE;,hWndParent:&HWND;,lpDialogFunc:p,dwInitParam:q||0
CreateDialogIndirectParamW|&HWND;|hInstance:&HINSTANCE;,lpTemplate:^@DLGTEMPLATE;,hWndParent:&HWND;,lpDialogFunc:p,dwInitParam:q||0
CreateDialogParamA|&HWND;|hInstance:&HINSTANCE;,lpTemplateName:^c,hWndParent:&HWND;,lpDialogFunc:p,dwInitParam:q||0
CreateDialogParamW|&HWND;|hInstance:&HINSTANCE;,lpTemplateName:^w,hWndParent:&HWND;,lpDialogFunc:p,dwInitParam:q||0
CreateIcon|&HICON;|hInstance:&HINSTANCE;,nWidth:i,nHeight:i,cPlanes:h,cBitsPixel:h,lpbANDbits:^h,lpbXORbits:^h||0
CreateIconFromResource|&HICON;|presbits:*h,dwResSize:m,fIcon:i,dwVer:m||0
CreateIconFromResourceEx|&HICON;|presbits:*h,dwResSize:m,fIcon:i,dwVer:m,cxDesired:i,cyDesired:i,Flags:u||0
CreateIconIndirect|&HICON;|piconinfo:*@ICONINFO;||0
CreateMDIWindowA|&HWND;|lpClassName:^c,lpWindowName:^c,dwStyle:m,X:i,Y:i,nWidth:i,nHeight:i,hWndParent:&HWND;,hInstance:&HINSTANCE;,lParam:q||0
CreateMDIWindowW|&HWND;|lpClassName:^w,lpWindowName:^w,dwStyle:m,X:i,Y:i,nWidth:i,nHeight:i,hWndParent:&HWND;,hInstance:&HINSTANCE;,lParam:q||0
CreateMenu|&HMENU;|||0
CreatePopupMenu|&HMENU;|||0
CreateWindowExA|&HWND;|dwExStyle:m,lpClassName:^c,lpWindowName:^c,dwStyle:m,X:i,Y:i,nWidth:i,nHeight:i,hWndParent:&HWND;,hMenu:&HMENU;,hInstance:&HINSTANCE;,lpParam:*v||0
CreateWindowExW|&HWND;|dwExStyle:m,lpClassName:^w,lpWindowName:^w,dwStyle:m,X:i,Y:i,nWidth:i,nHeight:i,hWndParent:&HWND;,hMenu:&HMENU;,hInstance:&HINSTANCE;,lpParam:*v||0
CreateWindowStationA|&HWINSTA;|lpwinsta:^c,dwFlags:m,dwDesiredAccess:m,lpsa:*@struct _SECURITY_ATTRIBUTES;||0
CreateWindowStationW|&HWINSTA;|lpwinsta:^w,dwFlags:m,dwDesiredAccess:m,lpsa:*@struct _SECURITY_ATTRIBUTES;||0
DefDlgProcA|q|hDlg:&HWND;,Msg:u,wParam:r,lParam:q||0
DefDlgProcW|q|hDlg:&HWND;,Msg:u,wParam:r,lParam:q||0
DefFrameProcA|q|hWnd:&HWND;,hWndMDIClient:&HWND;,uMsg:u,wParam:r,lParam:q||0
DefFrameProcW|q|hWnd:&HWND;,hWndMDIClient:&HWND;,uMsg:u,wParam:r,lParam:q||0
DefMDIChildProcA|q|hWnd:&HWND;,uMsg:u,wParam:r,lParam:q||0
DefMDIChildProcW|q|hWnd:&HWND;,uMsg:u,wParam:r,lParam:q||0
DefRawInputProc|q|paRawInput:**@struct tagRAWINPUT;,nInput:i,cbSizeHeader:u||0
DefWindowProcA|q|hWnd:&HWND;,Msg:u,wParam:r,lParam:q||0
DefWindowProcW|q|hWnd:&HWND;,Msg:u,wParam:r,lParam:q||0
DeferWindowPos|&HANDLE;|hWinPosInfo:&HANDLE;,hWnd:&HWND;,hWndInsertAfter:&HWND;,x:i,y:i,cx:i,cy:i,uFlags:u||0
DeleteMenu|i|hMenu:&HMENU;,uPosition:u,uFlags:u||0
DeregisterShellHookWindow|i|hwnd:&HWND;||0
DestroyAcceleratorTable|i|hAccel:&HACCEL;||0
DestroyCaret|i|||0
DestroyCursor|i|hCursor:&HICON;||0
DestroyIcon|i|hIcon:&HICON;||0
DestroyMenu|i|hMenu:&HMENU;||0
DestroySyntheticPointerDevice|v|device:&HSYNTHETICPOINTERDEVICE;||0
DestroyWindow|i|hWnd:&HWND;||0
DialogBoxIndirectParamA|q|hInstance:&HINSTANCE;,hDialogTemplate:^@DLGTEMPLATE;,hWndParent:&HWND;,lpDialogFunc:p,dwInitParam:q||0
DialogBoxIndirectParamW|q|hInstance:&HINSTANCE;,hDialogTemplate:^@DLGTEMPLATE;,hWndParent:&HWND;,lpDialogFunc:p,dwInitParam:q||0
DialogBoxParamA|q|hInstance:&HINSTANCE;,lpTemplateName:^c,hWndParent:&HWND;,lpDialogFunc:p,dwInitParam:q||0
DialogBoxParamW|q|hInstance:&HINSTANCE;,lpTemplateName:^w,hWndParent:&HWND;,lpDialogFunc:p,dwInitParam:q||0
DisableProcessWindowsGhosting|v|||0
DispatchMessageA|q|lpMsg:^@MSG;||0
DispatchMessageW|q|lpMsg:^@MSG;||0
DisplayConfigGetDeviceInfo|l|requestPacket:*@DISPLAYCONFIG_DEVICE_INFO_HEADER;||0
DisplayConfigSetDeviceInfo|l|setPacket:*@DISPLAYCONFIG_DEVICE_INFO_HEADER;||0
DlgDirListA|i|hDlg:&HWND;,lpPathSpec:*c,nIDListBox:i,nIDStaticPath:i,uFileType:u||0
DlgDirListComboBoxA|i|hDlg:&HWND;,lpPathSpec:*c,nIDComboBox:i,nIDStaticPath:i,uFiletype:u||0
DlgDirListComboBoxW|i|hDlg:&HWND;,lpPathSpec:*w,nIDComboBox:i,nIDStaticPath:i,uFiletype:u||0
DlgDirListW|i|hDlg:&HWND;,lpPathSpec:*w,nIDListBox:i,nIDStaticPath:i,uFileType:u||0
DlgDirSelectComboBoxExA|i|hwndDlg:&HWND;,lpString:*c,cchOut:i,idComboBox:i||0
DlgDirSelectComboBoxExW|i|hwndDlg:&HWND;,lpString:*w,cchOut:i,idComboBox:i||0
DlgDirSelectExA|i|hwndDlg:&HWND;,lpString:*c,chCount:i,idListBox:i||0
DlgDirSelectExW|i|hwndDlg:&HWND;,lpString:*w,chCount:i,idListBox:i||0
DragObject|m|hwndParent:&HWND;,hwndFrom:&HWND;,fmt:u,data:r,hcur:&HICON;||0
DrawAnimatedRects|i|hwnd:&HWND;,idAni:i,lprcFrom:^@RECT;,lprcTo:^@RECT;||0
DrawCaption|i|hwnd:&HWND;,hdc:&HDC;,lprect:^@RECT;,flags:u||0
DrawEdge|i|hdc:&HDC;,qrc:*@struct tagRECT;,edge:u,grfFlags:u||0
DrawFocusRect|i|hDC:&HDC;,lprc:^@RECT;||0
DrawFrameControl|i|a1:&HDC;,a2:*@struct tagRECT;,a3:u,a4:u||0
DrawIcon|i|hDC:&HDC;,X:i,Y:i,hIcon:&HICON;||0
DrawIconEx|i|hdc:&HDC;,xLeft:i,yTop:i,hIcon:&HICON;,cxWidth:i,cyWidth:i,istepIfAniCur:u,hbrFlickerFreeDraw:&HBRUSH;,diFlags:u||0
DrawMenuBar|i|hWnd:&HWND;||0
DrawStateA|i|hdc:&HDC;,hbrFore:&HBRUSH;,qfnCallBack:p,lData:q,wData:r,x:i,y:i,cx:i,cy:i,uFlags:u||0
DrawStateW|i|hdc:&HDC;,hbrFore:&HBRUSH;,qfnCallBack:p,lData:q,wData:r,x:i,y:i,cx:i,cy:i,uFlags:u||0
DrawTextA|i|hdc:&HDC;,lpchText:^c,cchText:i,lprc:*@struct tagRECT;,format:u||0
DrawTextExA|i|hdc:&HDC;,lpchText:*c,cchText:i,lprc:*@struct tagRECT;,format:u,lpdtp:*@struct tagDRAWTEXTPARAMS;||0
DrawTextExW|i|hdc:&HDC;,lpchText:*w,cchText:i,lprc:*@struct tagRECT;,format:u,lpdtp:*@struct tagDRAWTEXTPARAMS;||0
DrawTextW|i|hdc:&HDC;,lpchText:^w,cchText:i,lprc:*@struct tagRECT;,format:u||0
EmptyClipboard|i|||0
EnableMenuItem|i|hMenu:&HMENU;,uIDEnableItem:u,uEnable:u||0
EnableMouseInPointer|i|fEnable:i||0
EnableNonClientDpiScaling|i|hwnd:&HWND;||0
EnableScrollBar|i|hWnd:&HWND;,wSBflags:u,wArrows:u||0
EnableWindow|i|hWnd:&HWND;,bEnable:i||0
EndDeferWindowPos|i|hWinPosInfo:&HANDLE;||0
EndDialog|i|hDlg:&HWND;,nResult:q||0
EndMenu|i|||0
EndPaint|i|hWnd:&HWND;,lpPaint:^@PAINTSTRUCT;||0
EndTask|i|hWnd:&HWND;,fShutDown:i,fForce:i||0
EnumChildWindows|i|hWndParent:&HWND;,lpEnumFunc:p,lParam:q||0
EnumClipboardFormats|u|format:u||0
EnumDesktopWindows|i|hDesktop:&HDESK;,lpfn:p,lParam:q||0
EnumDesktopsA|i|hwinsta:&HWINSTA;,lpEnumFunc:p,lParam:q||0
EnumDesktopsW|i|hwinsta:&HWINSTA;,lpEnumFunc:p,lParam:q||0
EnumDisplayDevicesA|i|lpDevice:^c,iDevNum:m,lpDisplayDevice:*@struct _DISPLAY_DEVICEA;,dwFlags:m||0
EnumDisplayDevicesW|i|lpDevice:^w,iDevNum:m,lpDisplayDevice:*@struct _DISPLAY_DEVICEW;,dwFlags:m||0
EnumDisplayMonitors|i|hdc:&HDC;,lprcClip:^@RECT;,lpfnEnum:p,dwData:q||0
EnumDisplaySettingsA|i|lpszDeviceName:^c,iModeNum:m,lpDevMode:*@struct _devicemodeA;||0
EnumDisplaySettingsExA|i|lpszDeviceName:^c,iModeNum:m,lpDevMode:*@struct _devicemodeA;,dwFlags:m||0
EnumDisplaySettingsExW|i|lpszDeviceName:^w,iModeNum:m,lpDevMode:*@struct _devicemodeW;,dwFlags:m||0
EnumDisplaySettingsW|i|lpszDeviceName:^w,iModeNum:m,lpDevMode:*@struct _devicemodeW;||0
EnumPropsA|i|hWnd:&HWND;,lpEnumFunc:p||0
EnumPropsExA|i|hWnd:&HWND;,lpEnumFunc:p,lParam:q||0
EnumPropsExW|i|hWnd:&HWND;,lpEnumFunc:p,lParam:q||0
EnumPropsW|i|hWnd:&HWND;,lpEnumFunc:p||0
EnumThreadWindows|i|dwThreadId:m,lpfn:p,lParam:q||0
EnumWindowStationsA|i|lpEnumFunc:p,lParam:q||0
EnumWindowStationsW|i|lpEnumFunc:p,lParam:q||0
EnumWindows|i|lpEnumFunc:p,lParam:q||0
EqualRect|i|lprc1:^@RECT;,lprc2:^@RECT;||0
EvaluateProximityToPolygon|i|numVertices:u,controlPolygon:^@POINT;,pHitTestingInput:^@TOUCH_HIT_TESTING_INPUT;,pProximityEval:*@TOUCH_HIT_TESTING_PROXIMITY_EVALUATION;||0
EvaluateProximityToRect|i|controlBoundingBox:^@RECT;,pHitTestingInput:^@TOUCH_HIT_TESTING_INPUT;,pProximityEval:*@TOUCH_HIT_TESTING_PROXIMITY_EVALUATION;||0
ExcludeUpdateRgn|i|hDC:&HDC;,hWnd:&HWND;||0
ExitWindowsEx|i|uFlags:u,dwReason:m||0
FillRect|i|hDC:&HDC;,lprc:^@RECT;,hbr:&HBRUSH;||0
FindWindowA|&HWND;|lpClassName:^c,lpWindowName:^c||0
FindWindowExA|&HWND;|hWndParent:&HWND;,hWndChildAfter:&HWND;,lpszClass:^c,lpszWindow:^c||0
FindWindowExW|&HWND;|hWndParent:&HWND;,hWndChildAfter:&HWND;,lpszClass:^w,lpszWindow:^w||0
FindWindowW|&HWND;|lpClassName:^w,lpWindowName:^w||0
FlashWindow|i|hWnd:&HWND;,bInvert:i||0
FlashWindowEx|i|pfwi:*@struct FLASHWINFO;||0
FrameRect|i|hDC:&HDC;,lprc:^@RECT;,hbr:&HBRUSH;||0
GetActiveWindow|&HWND;|||0
GetAltTabInfoA|i|hwnd:&HWND;,iItem:i,pati:*@struct tagALTTABINFO;,pszItemText:*c,cchItemText:u||0
GetAltTabInfoW|i|hwnd:&HWND;,iItem:i,pati:*@struct tagALTTABINFO;,pszItemText:*w,cchItemText:u||0
GetAncestor|&HWND;|hwnd:&HWND;,gaFlags:u||0
GetAsyncKeyState|s|vKey:i||0
GetAwarenessFromDpiAwarenessContext|i|value:*@struct DPI_AWARENESS_CONTEXT__;||0
GetCIMSSM|i|inputMessageSource:*@INPUT_MESSAGE_SOURCE;||0
GetCapture|&HWND;|||0
GetCaretBlinkTime|u|||0
GetCaretPos|i|lpPoint:*@struct tagPOINT;||0
GetClassInfoA|i|hInstance:&HINSTANCE;,lpClassName:^c,lpWndClass:*@struct tagWNDCLASSA;||0
GetClassInfoExA|i|hInstance:&HINSTANCE;,lpszClass:^c,lpwcx:*@struct tagWNDCLASSEXA;||0
GetClassInfoExW|i|hInstance:&HINSTANCE;,lpszClass:^w,lpwcx:*@struct tagWNDCLASSEXW;||0
GetClassInfoW|i|hInstance:&HINSTANCE;,lpClassName:^w,lpWndClass:*@struct tagWNDCLASSW;||0
GetClassLongA|m|hWnd:&HWND;,nIndex:i||0
GetClassLongPtrA|r|hWnd:&HWND;,nIndex:i||0
GetClassLongPtrW|r|hWnd:&HWND;,nIndex:i||0
GetClassLongW|m|hWnd:&HWND;,nIndex:i||0
GetClassNameA|i|hWnd:&HWND;,lpClassName:*c,nMaxCount:i||0
GetClassNameW|i|hWnd:&HWND;,lpClassName:*w,nMaxCount:i||0
GetClassWord|t|hWnd:&HWND;,nIndex:i||0
GetClientRect|i|hWnd:&HWND;,lpRect:*@struct tagRECT;||0
GetClipCursor|i|lpRect:*@struct tagRECT;||0
GetClipboardData|&HANDLE;|uFormat:u||0
GetClipboardFormatNameA|i|format:u,lpszFormatName:*c,cchMaxCount:i||0
GetClipboardFormatNameW|i|format:u,lpszFormatName:*w,cchMaxCount:i||0
GetClipboardOwner|&HWND;|||0
GetClipboardSequenceNumber|m|||0
GetClipboardViewer|&HWND;|||0
GetComboBoxInfo|i|hwndCombo:&HWND;,pcbi:*@struct tagCOMBOBOXINFO;||0
GetCurrentInputMessageSource|i|inputMessageSource:*@INPUT_MESSAGE_SOURCE;||0
GetCursor|&HICON;|||0
GetCursorInfo|i|pci:*@struct tagCURSORINFO;||0
GetCursorPos|i|lpPoint:*@struct tagPOINT;||0
GetDC|&HDC;|hWnd:&HWND;||0
GetDCEx|&HDC;|hWnd:&HWND;,hrgnClip:&HRGN;,flags:m||0
GetDesktopWindow|&HWND;|||0
GetDialogBaseUnits|l|||0
GetDialogControlDpiChangeBehavior|u|hWnd:&HWND;||0
GetDialogDpiChangeBehavior|u|hDlg:&HWND;||0
GetDisplayAutoRotationPreferences|i|pOrientation:*u||0
GetDisplayConfigBufferSizes|l|flags:u,numPathArrayElements:*u,numModeInfoArrayElements:*u||0
GetDlgCtrlID|i|hWnd:&HWND;||0
GetDlgItem|&HWND;|hDlg:&HWND;,nIDDlgItem:i||0
GetDlgItemInt|u|hDlg:&HWND;,nIDDlgItem:i,lpTranslated:*i,bSigned:i||0
GetDlgItemTextA|u|hDlg:&HWND;,nIDDlgItem:i,lpString:*c,cchMax:i||0
GetDlgItemTextW|u|hDlg:&HWND;,nIDDlgItem:i,lpString:*w,cchMax:i||0
GetDoubleClickTime|u|||0
GetDpiAwarenessContextForProcess|*@struct DPI_AWARENESS_CONTEXT__;|hProcess:&HANDLE;||0
GetDpiForSystem|u|||0
GetDpiForWindow|u|hwnd:&HWND;||0
GetDpiFromDpiAwarenessContext|u|value:*@struct DPI_AWARENESS_CONTEXT__;||0
GetFocus|&HWND;|||0
GetForegroundWindow|&HWND;|||0
GetGUIThreadInfo|i|idThread:m,pgui:*@struct tagGUITHREADINFO;||0
GetGestureConfig|i|hwnd:&HWND;,dwReserved:m,dwFlags:m,pcIDs:*u,pGestureConfig:*@struct tagGESTURECONFIG;,cbSize:u||0
GetGestureExtraArgs|i|hGestureInfo:&HGESTUREINFO;,cbExtraArgs:u,pExtraArgs:*h||0
GetGestureInfo|i|hGestureInfo:&HGESTUREINFO;,pGestureInfo:*@struct tagGESTUREINFO;||0
GetGuiResources|m|hProcess:&HANDLE;,uiFlags:m||0
GetIconInfo|i|hIcon:&HICON;,piconinfo:*@ICONINFO;||0
GetIconInfoExA|i|hicon:&HICON;,piconinfo:*@struct _ICONINFOEXA;||0
GetIconInfoExW|i|hicon:&HICON;,piconinfo:*@struct _ICONINFOEXW;||0
GetInputState|i|||0
GetKBCodePage|u|||0
GetKeyNameTextA|i|lParam:l,lpString:*c,cchSize:i||0
GetKeyNameTextW|i|lParam:l,lpString:*w,cchSize:i||0
GetKeyState|s|nVirtKey:i||0
GetKeyboardLayout|&HKL;|idThread:m||0
GetKeyboardLayoutList|i|nBuff:i,lpList:*&HKL;||0
GetKeyboardLayoutNameA|i|pwszKLID:*c||0
GetKeyboardLayoutNameW|i|pwszKLID:*w||0
GetKeyboardState|i|lpKeyState:*h||0
GetKeyboardType|i|nTypeFlag:i||0
GetLastActivePopup|&HWND;|hWnd:&HWND;||0
GetLastInputInfo|i|plii:*@struct tagLASTINPUTINFO;||0
GetLayeredWindowAttributes|i|hwnd:&HWND;,pcrKey:*m,pbAlpha:*h,pdwFlags:*m||0
GetListBoxInfo|m|hwnd:&HWND;||0
GetMenu|&HMENU;|hWnd:&HWND;||0
GetMenuBarInfo|i|hwnd:&HWND;,idObject:l,idItem:l,pmbi:*@struct tagMENUBARINFO;||0
GetMenuCheckMarkDimensions|l|||0
GetMenuContextHelpId|m|a1:&HMENU;||0
GetMenuDefaultItem|u|hMenu:&HMENU;,fByPos:u,gmdiFlags:u||0
GetMenuInfo|i|a1:&HMENU;,a2:*@struct tagMENUINFO;||0
GetMenuItemCount|i|hMenu:&HMENU;||0
GetMenuItemID|u|hMenu:&HMENU;,nPos:i||0
GetMenuItemInfoA|i|hmenu:&HMENU;,item:u,fByPosition:i,lpmii:*@struct tagMENUITEMINFOA;||0
GetMenuItemInfoW|i|hmenu:&HMENU;,item:u,fByPosition:i,lpmii:*@struct tagMENUITEMINFOW;||0
GetMenuItemRect|i|hWnd:&HWND;,hMenu:&HMENU;,uItem:u,lprcItem:*@struct tagRECT;||0
GetMenuState|u|hMenu:&HMENU;,uId:u,uFlags:u||0
GetMenuStringA|i|hMenu:&HMENU;,uIDItem:u,lpString:*c,cchMax:i,flags:u||0
GetMenuStringW|i|hMenu:&HMENU;,uIDItem:u,lpString:*w,cchMax:i,flags:u||0
GetMessageA|i|lpMsg:*@struct tagMSG;,hWnd:&HWND;,wMsgFilterMin:u,wMsgFilterMax:u||0
GetMessageExtraInfo|q|||0
GetMessagePos|m|||0
GetMessageTime|l|||0
GetMessageW|i|lpMsg:*@struct tagMSG;,hWnd:&HWND;,wMsgFilterMin:u,wMsgFilterMax:u||0
GetMonitorInfoA|i|hMonitor:&HMONITOR;,lpmi:*@struct tagMONITORINFO;||0
GetMonitorInfoW|i|hMonitor:&HMONITOR;,lpmi:*@struct tagMONITORINFO;||0
GetMouseMovePointsEx|i|cbSize:u,lppt:*@struct tagMOUSEMOVEPOINT;,lpptBuf:*@struct tagMOUSEMOVEPOINT;,nBufPoints:i,resolution:m||0
GetNextDlgGroupItem|&HWND;|hDlg:&HWND;,hCtl:&HWND;,bPrevious:i||0
GetNextDlgTabItem|&HWND;|hDlg:&HWND;,hCtl:&HWND;,bPrevious:i||0
GetOpenClipboardWindow|&HWND;|||0
GetParent|&HWND;|hWnd:&HWND;||0
GetPhysicalCursorPos|i|lpPoint:*@struct tagPOINT;||0
GetPointerCursorId|i|pointerId:u,cursorId:*u||0
GetPointerDevice|i|device:&HANDLE;,pointerDevice:*@POINTER_DEVICE_INFO;||0
GetPointerDeviceCursors|i|device:&HANDLE;,cursorCount:*u,deviceCursors:*@POINTER_DEVICE_CURSOR_INFO;||0
GetPointerDeviceProperties|i|device:&HANDLE;,propertyCount:*u,pointerProperties:*@POINTER_DEVICE_PROPERTY;||0
GetPointerDeviceRects|i|device:&HANDLE;,pointerDeviceRect:*@RECT;,displayRect:*@RECT;||0
GetPointerDevices|i|deviceCount:*u,pointerDevices:*@POINTER_DEVICE_INFO;||0
GetPointerFrameInfo|i|pointerId:u,pointerCount:*u,pointerInfo:*@POINTER_INFO;||0
GetPointerFrameInfoHistory|i|pointerId:u,entriesCount:*u,pointerCount:*u,pointerInfo:*@POINTER_INFO;||0
GetPointerFramePenInfo|i|pointerId:u,pointerCount:*u,penInfo:*@POINTER_PEN_INFO;||0
GetPointerFramePenInfoHistory|i|pointerId:u,entriesCount:*u,pointerCount:*u,penInfo:*@POINTER_PEN_INFO;||0
GetPointerFrameTouchInfo|i|pointerId:u,pointerCount:*u,touchInfo:*@POINTER_TOUCH_INFO;||0
GetPointerFrameTouchInfoHistory|i|pointerId:u,entriesCount:*u,pointerCount:*u,touchInfo:*@POINTER_TOUCH_INFO;||0
GetPointerInfo|i|pointerId:u,pointerInfo:*@POINTER_INFO;||0
GetPointerInfoHistory|i|pointerId:u,entriesCount:*u,pointerInfo:*@POINTER_INFO;||0
GetPointerInputTransform|i|pointerId:u,historyCount:u,inputTransform:*@INPUT_TRANSFORM;||0
GetPointerPenInfo|i|pointerId:u,penInfo:*@POINTER_PEN_INFO;||0
GetPointerPenInfoHistory|i|pointerId:u,entriesCount:*u,penInfo:*@POINTER_PEN_INFO;||0
GetPointerTouchInfo|i|pointerId:u,touchInfo:*@POINTER_TOUCH_INFO;||0
GetPointerTouchInfoHistory|i|pointerId:u,entriesCount:*u,touchInfo:*@POINTER_TOUCH_INFO;||0
GetPointerType|i|pointerId:u,pointerType:*m||0
GetPriorityClipboardFormat|i|paFormatPriorityList:*u,cFormats:i||0
GetProcessDefaultLayout|i|pdwDefaultLayout:*m||0
GetProcessWindowStation|&HWINSTA;|||0
GetPropA|&HANDLE;|hWnd:&HWND;,lpString:^c||0
GetPropW|&HANDLE;|hWnd:&HWND;,lpString:^w||0
GetQueueStatus|m|flags:u||0
GetRawInputBuffer|u|pData:*@struct tagRAWINPUT;,pcbSize:*u,cbSizeHeader:u||0
GetRawInputData|u|hRawInput:&HRAWINPUT;,uiCommand:u,pData:*v,pcbSize:*u,cbSizeHeader:u||0
GetRawInputDeviceInfoA|u|hDevice:&HANDLE;,uiCommand:u,pData:*v,pcbSize:*u||0
GetRawInputDeviceInfoW|u|hDevice:&HANDLE;,uiCommand:u,pData:*v,pcbSize:*u||0
GetRawInputDeviceList|u|pRawInputDeviceList:*@struct tagRAWINPUTDEVICELIST;,puiNumDevices:*u,cbSize:u||0
GetRawPointerDeviceData|i|pointerId:u,historyCount:u,propertiesCount:u,pProperties:*@POINTER_DEVICE_PROPERTY;,pValues:*l||0
GetRegisteredRawInputDevices|u|pRawInputDevices:*@struct tagRAWINPUTDEVICE;,puiNumDevices:*u,cbSize:u||0
GetScrollBarInfo|i|hwnd:&HWND;,idObject:l,psbi:*@struct tagSCROLLBARINFO;||0
GetScrollInfo|i|hwnd:&HWND;,nBar:i,lpsi:*@struct tagSCROLLINFO;||0
GetScrollPos|i|hWnd:&HWND;,nBar:i||0
GetScrollRange|i|hWnd:&HWND;,nBar:i,lpMinPos:*i,lpMaxPos:*i||0
GetShellWindow|&HWND;|||0
GetSubMenu|&HMENU;|hMenu:&HMENU;,nPos:i||0
GetSysColor|m|nIndex:i||0
GetSysColorBrush|&HBRUSH;|nIndex:i||0
GetSystemDpiForProcess|u|hProcess:&HANDLE;||0
GetSystemMenu|&HMENU;|hWnd:&HWND;,bRevert:i||0
GetSystemMetrics|i|nIndex:i||0
GetSystemMetricsForDpi|i|nIndex:i,dpi:u||0
GetTabbedTextExtentA|m|hdc:&HDC;,lpString:^c,chCount:i,nTabPositions:i,lpnTabStopPositions:^i||0
GetTabbedTextExtentW|m|hdc:&HDC;,lpString:^w,chCount:i,nTabPositions:i,lpnTabStopPositions:^i||0
GetThreadDesktop|&HDESK;|dwThreadId:m||0
GetThreadDpiAwarenessContext|*@struct DPI_AWARENESS_CONTEXT__;|||0
GetThreadDpiHostingBehavior|i|||0
GetTitleBarInfo|i|hwnd:&HWND;,pti:*@struct tagTITLEBARINFO;||0
GetTopWindow|&HWND;|hWnd:&HWND;||0
GetTouchInputInfo|i|hTouchInput:&HTOUCHINPUT;,cInputs:u,pInputs:*@struct tagTOUCHINPUT;,cbSize:i||0
GetUnpredictedMessagePos|m|||0
GetUpdateRect|i|hWnd:&HWND;,lpRect:*@struct tagRECT;,bErase:i||0
GetUpdateRgn|i|hWnd:&HWND;,hRgn:&HRGN;,bErase:i||0
GetUpdatedClipboardFormats|i|lpuiFormats:*u,cFormats:u,pcFormatsOut:*u||0
GetUserObjectInformationA|i|hObj:&HANDLE;,nIndex:i,pvInfo:*v,nLength:m,lpnLengthNeeded:*m||0
GetUserObjectInformationW|i|hObj:&HANDLE;,nIndex:i,pvInfo:*v,nLength:m,lpnLengthNeeded:*m||0
GetUserObjectSecurity|i|hObj:&HANDLE;,pSIRequested:*m,pSID:*v,nLength:m,lpnLengthNeeded:*m||0
GetWindow|&HWND;|hWnd:&HWND;,uCmd:u||0
GetWindowContextHelpId|m|a1:&HWND;||0
GetWindowDC|&HDC;|hWnd:&HWND;||0
GetWindowDisplayAffinity|i|hWnd:&HWND;,pdwAffinity:*m||0
GetWindowDpiAwarenessContext|*@struct DPI_AWARENESS_CONTEXT__;|hwnd:&HWND;||0
GetWindowDpiHostingBehavior|i|hwnd:&HWND;||0
GetWindowFeedbackSetting|i|hwnd:&HWND;,feedback:u,dwFlags:m,pSize:*u,config:*v||0
GetWindowInfo|i|hwnd:&HWND;,pwi:*@struct tagWINDOWINFO;||0
GetWindowLongA|l|hWnd:&HWND;,nIndex:i||0
GetWindowLongPtrA|q|hWnd:&HWND;,nIndex:i||0
GetWindowLongPtrW|q|hWnd:&HWND;,nIndex:i||0
GetWindowLongW|l|hWnd:&HWND;,nIndex:i||0
GetWindowModuleFileNameA|u|hwnd:&HWND;,pszFileName:*c,cchFileNameMax:u||0
GetWindowModuleFileNameW|u|hwnd:&HWND;,pszFileName:*w,cchFileNameMax:u||0
GetWindowPlacement|i|hWnd:&HWND;,lpwndpl:*@WINDOWPLACEMENT;||0
GetWindowRect|i|hWnd:&HWND;,lpRect:*@struct tagRECT;||0
GetWindowRgn|i|hWnd:&HWND;,hRgn:&HRGN;||0
GetWindowRgnBox|i|hWnd:&HWND;,lprc:*@struct tagRECT;||0
GetWindowTextA|i|hWnd:&HWND;,lpString:*c,nMaxCount:i||0
GetWindowTextLengthA|i|hWnd:&HWND;||0
GetWindowTextLengthW|i|hWnd:&HWND;||0
GetWindowTextW|i|hWnd:&HWND;,lpString:*w,nMaxCount:i||0
GetWindowThreadProcessId|m|hWnd:&HWND;,lpdwProcessId:*m||0
GetWindowWord|t|hWnd:&HWND;,nIndex:i||0
GrayStringA|i|hDC:&HDC;,hBrush:&HBRUSH;,lpOutputFunc:p,lpData:q,nCount:i,X:i,Y:i,nWidth:i,nHeight:i||0
GrayStringW|i|hDC:&HDC;,hBrush:&HBRUSH;,lpOutputFunc:p,lpData:q,nCount:i,X:i,Y:i,nWidth:i,nHeight:i||0
HideCaret|i|hWnd:&HWND;||0
HiliteMenuItem|i|hWnd:&HWND;,hMenu:&HMENU;,uIDHiliteItem:u,uHilite:u||0
InSendMessage|i|||0
InSendMessageEx|m|lpReserved:*v||0
InflateRect|i|lprc:*@struct tagRECT;,dx:i,dy:i||0
InheritWindowMonitor|i|hwnd:&HWND;,hwndInherit:&HWND;||0
InitializeTouchInjection|i|maxCount:u,dwMode:m||0
InjectSyntheticPointerInput|i|device:&HSYNTHETICPOINTERDEVICE;,pointerInfo:^@POINTER_TYPE_INFO;,count:u||0
InjectTouchInput|i|count:u,contacts:^@POINTER_TOUCH_INFO;||0
InsertMenuA|i|hMenu:&HMENU;,uPosition:u,uFlags:u,uIDNewItem:r,lpNewItem:^c||0
InsertMenuItemA|i|hmenu:&HMENU;,item:u,fByPosition:i,lpmi:^@MENUITEMINFOA;||0
InsertMenuItemW|i|hmenu:&HMENU;,item:u,fByPosition:i,lpmi:^@MENUITEMINFOW;||0
InsertMenuW|i|hMenu:&HMENU;,uPosition:u,uFlags:u,uIDNewItem:r,lpNewItem:^w||0
InternalGetWindowText|i|hWnd:&HWND;,pString:*w,cchMaxCount:i||0
IntersectRect|i|lprcDst:*@struct tagRECT;,lprcSrc1:^@RECT;,lprcSrc2:^@RECT;||0
InvalidateRect|i|hWnd:&HWND;,lpRect:^@RECT;,bErase:i||0
InvalidateRgn|i|hWnd:&HWND;,hRgn:&HRGN;,bErase:i||0
InvertRect|i|hDC:&HDC;,lprc:^@RECT;||0
IsCharAlphaA|i|ch:c||0
IsCharAlphaNumericA|i|ch:c||0
IsCharAlphaNumericW|i|ch:w||0
IsCharAlphaW|i|ch:w||0
IsCharLowerA|i|ch:c||0
IsCharLowerW|i|ch:w||0
IsCharUpperA|i|ch:c||0
IsCharUpperW|i|ch:w||0
IsChild|i|hWndParent:&HWND;,hWnd:&HWND;||0
IsClipboardFormatAvailable|i|format:u||0
IsDialogMessageA|i|hDlg:&HWND;,lpMsg:*@struct tagMSG;||0
IsDialogMessageW|i|hDlg:&HWND;,lpMsg:*@struct tagMSG;||0
IsDlgButtonChecked|u|hDlg:&HWND;,nIDButton:i||0
IsGUIThread|i|bConvert:i||0
IsHungAppWindow|i|hwnd:&HWND;||0
IsIconic|i|hWnd:&HWND;||0
IsImmersiveProcess|i|hProcess:&HANDLE;||0
IsMenu|i|hMenu:&HMENU;||0
IsMouseInPointerEnabled|i|||0
IsProcessDPIAware|i|||0
IsRectEmpty|i|lprc:^@RECT;||0
IsTouchWindow|i|hwnd:&HWND;,pulFlags:*m||0
IsValidDpiAwarenessContext|i|value:*@struct DPI_AWARENESS_CONTEXT__;||0
IsWinEventHookInstalled|i|event:m||0
IsWindow|i|hWnd:&HWND;||0
IsWindowEnabled|i|hWnd:&HWND;||0
IsWindowUnicode|i|hWnd:&HWND;||0
IsWindowVisible|i|hWnd:&HWND;||0
IsWow64Message|i|||0
IsZoomed|i|hWnd:&HWND;||0
KillTimer|i|hWnd:&HWND;,uIDEvent:r||0
LoadAcceleratorsA|&HACCEL;|hInstance:&HINSTANCE;,lpTableName:^c||0
LoadAcceleratorsW|&HACCEL;|hInstance:&HINSTANCE;,lpTableName:^w||0
LoadBitmapA|&HBITMAP;|hInstance:&HINSTANCE;,lpBitmapName:^c||0
LoadBitmapW|&HBITMAP;|hInstance:&HINSTANCE;,lpBitmapName:^w||0
LoadCursorA|&HICON;|hInstance:&HINSTANCE;,lpCursorName:^c||0
LoadCursorFromFileA|&HICON;|lpFileName:^c||0
LoadCursorFromFileW|&HICON;|lpFileName:^w||0
LoadCursorW|&HICON;|hInstance:&HINSTANCE;,lpCursorName:^w||0
LoadIconA|&HICON;|hInstance:&HINSTANCE;,lpIconName:^c||0
LoadIconW|&HICON;|hInstance:&HINSTANCE;,lpIconName:^w||0
LoadImageA|&HANDLE;|hInst:&HINSTANCE;,name:^c,type:u,cx:i,cy:i,fuLoad:u||0
LoadImageW|&HANDLE;|hInst:&HINSTANCE;,name:^w,type:u,cx:i,cy:i,fuLoad:u||0
LoadKeyboardLayoutA|&HKL;|pwszKLID:^c,Flags:u||0
LoadKeyboardLayoutW|&HKL;|pwszKLID:^w,Flags:u||0
LoadMenuA|&HMENU;|hInstance:&HINSTANCE;,lpMenuName:^c||0
LoadMenuIndirectA|&HMENU;|lpMenuTemplate:^v||0
LoadMenuIndirectW|&HMENU;|lpMenuTemplate:^v||0
LoadMenuW|&HMENU;|hInstance:&HINSTANCE;,lpMenuName:^w||0
LoadStringA|i|hInstance:&HINSTANCE;,uID:u,lpBuffer:*c,cchBufferMax:i||1
LoadStringW|i|hInstance:&HINSTANCE;,uID:u,lpBuffer:*w,cchBufferMax:i||1
LockSetForegroundWindow|i|uLockCode:u||0
LockWindowUpdate|i|hWndLock:&HWND;||0
LockWorkStation|i|||0
LogicalToPhysicalPoint|i|hWnd:&HWND;,lpPoint:*@struct tagPOINT;||0
LogicalToPhysicalPointForPerMonitorDPI|i|hwnd:&HWND;,lpPoint:*@struct tagPOINT;||0
LookupIconIdFromDirectory|i|presbits:*h,fIcon:i||0
LookupIconIdFromDirectoryEx|i|presbits:*h,fIcon:i,cxDesired:i,cyDesired:i,Flags:u||0
MapDialogRect|i|hDlg:&HWND;,lpRect:*@struct tagRECT;||0
MapVirtualKeyA|u|uCode:u,uMapType:u||0
MapVirtualKeyExA|u|uCode:u,uMapType:u,dwhkl:&HKL;||0
MapVirtualKeyExW|u|uCode:u,uMapType:u,dwhkl:&HKL;||0
MapVirtualKeyW|u|uCode:u,uMapType:u||0
MapWindowPoints|i|hWndFrom:&HWND;,hWndTo:&HWND;,lpPoints:*@struct tagPOINT;,cPoints:u||0
MessageBeep|i|uType:u||0
MessageBoxA|i|hWnd:&HWND;,lpText:^c,lpCaption:^c,uType:u||0
MessageBoxExA|i|hWnd:&HWND;,lpText:^c,lpCaption:^c,uType:u,wLanguageId:t||0
MessageBoxExW|i|hWnd:&HWND;,lpText:^w,lpCaption:^w,uType:u,wLanguageId:t||0
MessageBoxIndirectA|i|lpmbp:^@MSGBOXPARAMSA;||0
MessageBoxIndirectW|i|lpmbp:^@MSGBOXPARAMSW;||0
MessageBoxW|i|hWnd:&HWND;,lpText:^w,lpCaption:^w,uType:u||0
ModifyMenuA|i|hMnu:&HMENU;,uPosition:u,uFlags:u,uIDNewItem:r,lpNewItem:^c||0
ModifyMenuW|i|hMnu:&HMENU;,uPosition:u,uFlags:u,uIDNewItem:r,lpNewItem:^w||0
MonitorFromRect|&HMONITOR;|lprc:^@RECT;,dwFlags:m||0
MonitorFromWindow|&HMONITOR;|hwnd:&HWND;,dwFlags:m||0
MoveWindow|i|hWnd:&HWND;,X:i,Y:i,nWidth:i,nHeight:i,bRepaint:i||0
MsgWaitForMultipleObjects|m|nCount:m,pHandles:^&HANDLE;,fWaitAll:i,dwMilliseconds:m,dwWakeMask:m||0
MsgWaitForMultipleObjectsEx|m|nCount:m,pHandles:^&HANDLE;,dwMilliseconds:m,dwWakeMask:m,dwFlags:m||0
NotifyWinEvent|v|event:m,hwnd:&HWND;,idObject:l,idChild:l||0
OemKeyScan|m|wOemChar:t||0
OemToCharA|i|lpszSrc:^c,lpszDst:*c||0
OemToCharBuffA|i|lpszSrc:^c,lpszDst:*c,cchDstLength:m||0
OemToCharBuffW|i|lpszSrc:^c,lpszDst:*w,cchDstLength:m||0
OemToCharW|i|lpszSrc:^c,lpszDst:*w||0
OffsetRect|i|lprc:*@struct tagRECT;,dx:i,dy:i||0
OpenClipboard|i|hWndNewOwner:&HWND;||0
OpenDesktopA|&HDESK;|lpszDesktop:^c,dwFlags:m,fInherit:i,dwDesiredAccess:m||0
OpenDesktopW|&HDESK;|lpszDesktop:^w,dwFlags:m,fInherit:i,dwDesiredAccess:m||0
OpenIcon|i|hWnd:&HWND;||0
OpenInputDesktop|&HDESK;|dwFlags:m,fInherit:i,dwDesiredAccess:m||0
OpenWindowStationA|&HWINSTA;|lpszWinSta:^c,fInherit:i,dwDesiredAccess:m||0
OpenWindowStationW|&HWINSTA;|lpszWinSta:^w,fInherit:i,dwDesiredAccess:m||0
PackTouchHitTestingProximityEvaluation|q|pHitTestingInput:^@TOUCH_HIT_TESTING_INPUT;,pProximityEval:^@TOUCH_HIT_TESTING_PROXIMITY_EVALUATION;||0
PaintDesktop|i|hdc:&HDC;||0
PeekMessageA|i|lpMsg:*@struct tagMSG;,hWnd:&HWND;,wMsgFilterMin:u,wMsgFilterMax:u,wRemoveMsg:u||0
PeekMessageW|i|lpMsg:*@struct tagMSG;,hWnd:&HWND;,wMsgFilterMin:u,wMsgFilterMax:u,wRemoveMsg:u||0
PhysicalToLogicalPoint|i|hWnd:&HWND;,lpPoint:*@struct tagPOINT;||0
PhysicalToLogicalPointForPerMonitorDPI|i|hwnd:&HWND;,lpPoint:*@struct tagPOINT;||0
PostMessageA|i|hWnd:&HWND;,Msg:u,wParam:r,lParam:q||0
PostMessageW|i|hWnd:&HWND;,Msg:u,wParam:r,lParam:q||0
PostQuitMessage|v|nExitCode:i||0
PostThreadMessageA|i|idThread:m,Msg:u,wParam:r,lParam:q||0
PostThreadMessageW|i|idThread:m,Msg:u,wParam:r,lParam:q||0
PrintWindow|i|hwnd:&HWND;,hdcBlt:&HDC;,nFlags:u||0
PrivateExtractIconsA|u|szFileName:^c,nIconIndex:i,cxIcon:i,cyIcon:i,phicon:*&HICON;,piconid:*u,nIcons:u,flags:u||0
PrivateExtractIconsW|u|szFileName:^w,nIconIndex:i,cxIcon:i,cyIcon:i,phicon:*&HICON;,piconid:*u,nIcons:u,flags:u||0
QueryDisplayConfig|l|flags:u,numPathArrayElements:*u,pathArray:*@DISPLAYCONFIG_PATH_INFO;,numModeInfoArrayElements:*u,modeInfoArray:*@DISPLAYCONFIG_MODE_INFO;,currentTopologyId:*u||0
RealGetWindowClassA|u|hwnd:&HWND;,ptszClassName:*c,cchClassNameMax:u||0
RealGetWindowClassW|u|hwnd:&HWND;,ptszClassName:*w,cchClassNameMax:u||0
RedrawWindow|i|hWnd:&HWND;,lprcUpdate:^@RECT;,hrgnUpdate:&HRGN;,flags:u||0
RegisterClassA|t|lpWndClass:^@WNDCLASSA;||0
RegisterClassExA|t|a1:^@WNDCLASSEXA;||0
RegisterClassExW|t|a1:^@WNDCLASSEXW;||0
RegisterClassW|t|lpWndClass:^@WNDCLASSW;||0
RegisterClipboardFormatA|u|lpszFormat:^c||0
RegisterClipboardFormatW|u|lpszFormat:^w||0
RegisterDeviceNotificationA|*v|hRecipient:&HANDLE;,NotificationFilter:*v,Flags:m||0
RegisterDeviceNotificationW|*v|hRecipient:&HANDLE;,NotificationFilter:*v,Flags:m||0
RegisterHotKey|i|hWnd:&HWND;,id:i,fsModifiers:u,vk:u||0
RegisterPointerDeviceNotifications|i|window:&HWND;,notifyRange:i||0
RegisterPointerInputTarget|i|hwnd:&HWND;,pointerType:m||0
RegisterPointerInputTargetEx|i|hwnd:&HWND;,pointerType:m,fObserve:i||0
RegisterPowerSettingNotification|&HANDLE;|hRecipient:&HANDLE;,PowerSettingGuid:^@GUID;,Flags:m||0
RegisterRawInputDevices|i|pRawInputDevices:^@RAWINPUTDEVICE;,uiNumDevices:u,cbSize:u||0
RegisterShellHookWindow|i|hwnd:&HWND;||0
RegisterSuspendResumeNotification|&HANDLE;|hRecipient:&HANDLE;,Flags:m||0
RegisterTouchHitTestingWindow|i|hwnd:&HWND;,value:m||0
RegisterTouchWindow|i|hwnd:&HWND;,ulFlags:m||0
RegisterWindowMessageA|u|lpString:^c||0
RegisterWindowMessageW|u|lpString:^w||0
ReleaseCapture|i|||0
ReleaseDC|i|hWnd:&HWND;,hDC:&HDC;||0
RemoveClipboardFormatListener|i|hwnd:&HWND;||0
RemoveMenu|i|hMenu:&HMENU;,uPosition:u,uFlags:u||0
RemovePropA|&HANDLE;|hWnd:&HWND;,lpString:^c||0
RemovePropW|&HANDLE;|hWnd:&HWND;,lpString:^w||0
ReplyMessage|i|lResult:q||0
ScreenToClient|i|hWnd:&HWND;,lpPoint:*@struct tagPOINT;||0
ScrollDC|i|hDC:&HDC;,dx:i,dy:i,lprcScroll:^@RECT;,lprcClip:^@RECT;,hrgnUpdate:&HRGN;,lprcUpdate:*@struct tagRECT;||0
ScrollWindow|i|hWnd:&HWND;,XAmount:i,YAmount:i,lpRect:^@RECT;,lpClipRect:^@RECT;||0
ScrollWindowEx|i|hWnd:&HWND;,dx:i,dy:i,prcScroll:^@RECT;,prcClip:^@RECT;,hrgnUpdate:&HRGN;,prcUpdate:*@struct tagRECT;,flags:u||0
SendDlgItemMessageA|q|hDlg:&HWND;,nIDDlgItem:i,Msg:u,wParam:r,lParam:q||0
SendDlgItemMessageW|q|hDlg:&HWND;,nIDDlgItem:i,Msg:u,wParam:r,lParam:q||0
SendInput|u|cInputs:u,pInputs:*@struct tagINPUT;,cbSize:i||0
SendMessageA|q|hWnd:&HWND;,Msg:u,wParam:r,lParam:q||0
SendMessageCallbackA|i|hWnd:&HWND;,Msg:u,wParam:r,lParam:q,lpResultCallBack:p,dwData:r||0
SendMessageCallbackW|i|hWnd:&HWND;,Msg:u,wParam:r,lParam:q,lpResultCallBack:p,dwData:r||0
SendMessageTimeoutA|q|hWnd:&HWND;,Msg:u,wParam:r,lParam:q,fuFlags:u,uTimeout:u,lpdwResult:*r||0
SendMessageTimeoutW|q|hWnd:&HWND;,Msg:u,wParam:r,lParam:q,fuFlags:u,uTimeout:u,lpdwResult:*r||0
SendMessageW|q|hWnd:&HWND;,Msg:u,wParam:r,lParam:q||0
SendNotifyMessageA|i|hWnd:&HWND;,Msg:u,wParam:r,lParam:q||0
SendNotifyMessageW|i|hWnd:&HWND;,Msg:u,wParam:r,lParam:q||0
SetActiveWindow|&HWND;|hWnd:&HWND;||0
SetCapture|&HWND;|hWnd:&HWND;||0
SetCaretBlinkTime|i|uMSeconds:u||0
SetCaretPos|i|X:i,Y:i||0
SetClassLongA|m|hWnd:&HWND;,nIndex:i,dwNewLong:l||0
SetClassLongPtrA|r|hWnd:&HWND;,nIndex:i,dwNewLong:q||0
SetClassLongPtrW|r|hWnd:&HWND;,nIndex:i,dwNewLong:q||0
SetClassLongW|m|hWnd:&HWND;,nIndex:i,dwNewLong:l||0
SetClassWord|t|hWnd:&HWND;,nIndex:i,wNewWord:t||0
SetClipboardData|&HANDLE;|uFormat:u,hMem:&HANDLE;||0
SetClipboardViewer|&HWND;|hWndNewViewer:&HWND;||0
SetCoalescableTimer|r|hWnd:&HWND;,nIDEvent:r,uElapse:u,lpTimerFunc:p,uToleranceDelay:m||0
SetCursor|&HICON;|hCursor:&HICON;||0
SetCursorPos|i|X:i,Y:i||0
SetDebugErrorLevel|v|dwLevel:m||0
SetDialogControlDpiChangeBehavior|i|hWnd:&HWND;,mask:u,values:u||0
SetDialogDpiChangeBehavior|i|hDlg:&HWND;,mask:u,values:u||0
SetDisplayAutoRotationPreferences|i|orientation:u||0
SetDisplayConfig|l|numPathArrayElements:u,pathArray:*@DISPLAYCONFIG_PATH_INFO;,numModeInfoArrayElements:u,modeInfoArray:*@DISPLAYCONFIG_MODE_INFO;,flags:u||0
SetDlgItemInt|i|hDlg:&HWND;,nIDDlgItem:i,uValue:u,bSigned:i||0
SetDlgItemTextA|i|hDlg:&HWND;,nIDDlgItem:i,lpString:^c||0
SetDlgItemTextW|i|hDlg:&HWND;,nIDDlgItem:i,lpString:^w||0
SetDoubleClickTime|i|a1:u||0
SetFocus|&HWND;|hWnd:&HWND;||0
SetForegroundWindow|i|hWnd:&HWND;||0
SetGestureConfig|i|hwnd:&HWND;,dwReserved:m,cIDs:u,pGestureConfig:*@struct tagGESTURECONFIG;,cbSize:u||0
SetKeyboardState|i|lpKeyState:*h||0
SetLastErrorEx|v|dwErrCode:m,dwType:m||0
SetLayeredWindowAttributes|i|hwnd:&HWND;,crKey:m,bAlpha:h,dwFlags:m||0
SetMenu|i|hWnd:&HWND;,hMenu:&HMENU;||0
SetMenuContextHelpId|i|a1:&HMENU;,a2:m||0
SetMenuDefaultItem|i|hMenu:&HMENU;,uItem:u,fByPos:u||0
SetMenuInfo|i|a1:&HMENU;,a2:^@MENUINFO;||0
SetMenuItemBitmaps|i|hMenu:&HMENU;,uPosition:u,uFlags:u,hBitmapUnchecked:&HBITMAP;,hBitmapChecked:&HBITMAP;||0
SetMenuItemInfoA|i|hmenu:&HMENU;,item:u,fByPositon:i,lpmii:^@MENUITEMINFOA;||0
SetMenuItemInfoW|i|hmenu:&HMENU;,item:u,fByPositon:i,lpmii:^@MENUITEMINFOW;||0
SetMessageExtraInfo|q|lParam:q||0
SetMessageQueue|i|cMessagesMax:i||0
SetParent|&HWND;|hWndChild:&HWND;,hWndNewParent:&HWND;||0
SetPhysicalCursorPos|i|X:i,Y:i||0
SetProcessDPIAware|i|||0
SetProcessDefaultLayout|i|dwDefaultLayout:m||0
SetProcessDpiAwarenessContext|i|value:*@struct DPI_AWARENESS_CONTEXT__;||0
SetProcessRestrictionExemption|i|fEnableExemption:i||0
SetProcessWindowStation|i|hWinSta:&HWINSTA;||0
SetPropA|i|hWnd:&HWND;,lpString:^c,hData:&HANDLE;||0
SetPropW|i|hWnd:&HWND;,lpString:^w,hData:&HANDLE;||0
SetRect|i|lprc:*@struct tagRECT;,xLeft:i,yTop:i,xRight:i,yBottom:i||0
SetRectEmpty|i|lprc:*@struct tagRECT;||0
SetScrollInfo|i|hwnd:&HWND;,nBar:i,lpsi:^@SCROLLINFO;,redraw:i||0
SetScrollPos|i|hWnd:&HWND;,nBar:i,nPos:i,bRedraw:i||0
SetScrollRange|i|hWnd:&HWND;,nBar:i,nMinPos:i,nMaxPos:i,bRedraw:i||0
SetSysColors|i|cElements:i,lpaElements:^i,lpaRgbValues:^m||0
SetSystemCursor|i|hcur:&HICON;,id:m||0
SetThreadDesktop|i|hDesktop:&HDESK;||0
SetThreadDpiAwarenessContext|*@struct DPI_AWARENESS_CONTEXT__;|dpiContext:*@struct DPI_AWARENESS_CONTEXT__;||0
SetThreadDpiHostingBehavior|i|value:i||0
SetTimer|r|hWnd:&HWND;,nIDEvent:r,uElapse:u,lpTimerFunc:p||0
SetUserObjectInformationA|i|hObj:&HANDLE;,nIndex:i,pvInfo:*v,nLength:m||0
SetUserObjectInformationW|i|hObj:&HANDLE;,nIndex:i,pvInfo:*v,nLength:m||0
SetUserObjectSecurity|i|hObj:&HANDLE;,pSIRequested:*m,pSID:*v||0
SetWinEventHook|&HWINEVENTHOOK;|eventMin:m,eventMax:m,hmodWinEventProc:&HINSTANCE;,pfnWinEventProc:p,idProcess:m,idThread:m,dwFlags:m||0
SetWindowContextHelpId|i|a1:&HWND;,a2:m||0
SetWindowDisplayAffinity|i|hWnd:&HWND;,dwAffinity:m||0
SetWindowFeedbackSetting|i|hwnd:&HWND;,feedback:u,dwFlags:m,size:u,configuration:^v||0
SetWindowLongA|l|hWnd:&HWND;,nIndex:i,dwNewLong:l||0
SetWindowLongPtrA|q|hWnd:&HWND;,nIndex:i,dwNewLong:q||0
SetWindowLongPtrW|q|hWnd:&HWND;,nIndex:i,dwNewLong:q||0
SetWindowLongW|l|hWnd:&HWND;,nIndex:i,dwNewLong:l||0
SetWindowPlacement|i|hWnd:&HWND;,lpwndpl:^@WINDOWPLACEMENT;||0
SetWindowPos|i|hWnd:&HWND;,hWndInsertAfter:&HWND;,X:i,Y:i,cx:i,cy:i,uFlags:u||0
SetWindowRgn|i|hWnd:&HWND;,hRgn:&HRGN;,bRedraw:i||0
SetWindowTextA|i|hWnd:&HWND;,lpString:^c||0
SetWindowTextW|i|hWnd:&HWND;,lpString:^w||0
SetWindowWord|t|hWnd:&HWND;,nIndex:i,wNewWord:t||0
SetWindowsHookA|&HHOOK;|nFilterType:i,pfnFilterProc:p||0
SetWindowsHookExA|&HHOOK;|idHook:i,lpfn:p,hmod:&HINSTANCE;,dwThreadId:m||0
SetWindowsHookExW|&HHOOK;|idHook:i,lpfn:p,hmod:&HINSTANCE;,dwThreadId:m||0
SetWindowsHookW|&HHOOK;|nFilterType:i,pfnFilterProc:p||0
ShowCaret|i|hWnd:&HWND;||0
ShowCursor|i|bShow:i||0
ShowOwnedPopups|i|hWnd:&HWND;,fShow:i||0
ShowScrollBar|i|hWnd:&HWND;,wBar:i,bShow:i||0
ShowWindow|i|hWnd:&HWND;,nCmdShow:i||0
ShowWindowAsync|i|hWnd:&HWND;,nCmdShow:i||0
ShutdownBlockReasonCreate|i|hWnd:&HWND;,pwszReason:^w||0
ShutdownBlockReasonDestroy|i|hWnd:&HWND;||0
ShutdownBlockReasonQuery|i|hWnd:&HWND;,pwszBuff:*w,pcchBuff:*m||0
SkipPointerFrameMessages|i|pointerId:u||0
SoundSentry|i|||0
SubtractRect|i|lprcDst:*@struct tagRECT;,lprcSrc1:^@RECT;,lprcSrc2:^@RECT;||0
SwapMouseButton|i|fSwap:i||0
SwitchDesktop|i|hDesktop:&HDESK;||0
SwitchToThisWindow|v|hwnd:&HWND;,fUnknown:i||0
SystemParametersInfoA|i|uiAction:u,uiParam:u,pvParam:*v,fWinIni:u||0
SystemParametersInfoForDpi|i|uiAction:u,uiParam:u,pvParam:*v,fWinIni:u,dpi:u||0
SystemParametersInfoW|i|uiAction:u,uiParam:u,pvParam:*v,fWinIni:u||0
TabbedTextOutA|l|hdc:&HDC;,x:i,y:i,lpString:^c,chCount:i,nTabPositions:i,lpnTabStopPositions:^i,nTabOrigin:i||0
TabbedTextOutW|l|hdc:&HDC;,x:i,y:i,lpString:^w,chCount:i,nTabPositions:i,lpnTabStopPositions:^i,nTabOrigin:i||0
TileWindows|t|hwndParent:&HWND;,wHow:u,lpRect:^@RECT;,cKids:u,lpKids:^&HWND;||0
ToAscii|i|uVirtKey:u,uScanCode:u,lpKeyState:^h,lpChar:*t,uFlags:u||0
ToAsciiEx|i|uVirtKey:u,uScanCode:u,lpKeyState:^h,lpChar:*t,uFlags:u,dwhkl:&HKL;||0
ToUnicode|i|wVirtKey:u,wScanCode:u,lpKeyState:^h,pwszBuff:*w,cchBuff:i,wFlags:u||0
ToUnicodeEx|i|wVirtKey:u,wScanCode:u,lpKeyState:^h,pwszBuff:*w,cchBuff:i,wFlags:u,dwhkl:&HKL;||0
TrackMouseEvent|i|lpEventTrack:*@struct tagTRACKMOUSEEVENT;||0
TrackPopupMenu|i|hMenu:&HMENU;,uFlags:u,x:i,y:i,nReserved:i,hWnd:&HWND;,prcRect:^@RECT;||0
TrackPopupMenuEx|i|a1:&HMENU;,a2:u,a3:i,a4:i,a5:&HWND;,a6:*@TPMPARAMS;||0
TranslateAcceleratorA|i|hWnd:&HWND;,hAccTable:&HACCEL;,lpMsg:*@struct tagMSG;||0
TranslateAcceleratorW|i|hWnd:&HWND;,hAccTable:&HACCEL;,lpMsg:*@struct tagMSG;||0
TranslateMDISysAccel|i|hWndClient:&HWND;,lpMsg:*@struct tagMSG;||0
TranslateMessage|i|lpMsg:^@MSG;||0
UnhookWinEvent|i|hWinEventHook:&HWINEVENTHOOK;||0
UnhookWindowsHook|i|nCode:i,pfnFilterProc:p||0
UnhookWindowsHookEx|i|hhk:&HHOOK;||0
UnionRect|i|lprcDst:*@struct tagRECT;,lprcSrc1:^@RECT;,lprcSrc2:^@RECT;||0
UnloadKeyboardLayout|i|hkl:&HKL;||0
UnregisterClassA|i|lpClassName:^c,hInstance:&HINSTANCE;||0
UnregisterClassW|i|lpClassName:^w,hInstance:&HINSTANCE;||0
UnregisterDeviceNotification|i|Handle:*v||0
UnregisterHotKey|i|hWnd:&HWND;,id:i||0
UnregisterPointerInputTarget|i|hwnd:&HWND;,pointerType:m||0
UnregisterPointerInputTargetEx|i|hwnd:&HWND;,pointerType:m||0
UnregisterPowerSettingNotification|i|Handle:&HANDLE;||0
UnregisterSuspendResumeNotification|i|Handle:&HANDLE;||0
UnregisterTouchWindow|i|hwnd:&HWND;||0
UpdateLayeredWindow|i|hWnd:&HWND;,hdcDst:&HDC;,pptDst:*@POINT;,psize:*@SIZE;,hdcSrc:&HDC;,pptSrc:*@POINT;,crKey:m,pblend:*@BLENDFUNCTION;,dwFlags:m||0
UpdateLayeredWindowIndirect|i|hWnd:&HWND;,pULWInfo:^@UPDATELAYEREDWINDOWINFO;||0
UpdateWindow|i|hWnd:&HWND;||0
UserHandleGrantAccess|i|hUserHandle:&HANDLE;,hJob:&HANDLE;,bGrant:i||0
ValidateRect|i|hWnd:&HWND;,lpRect:^@RECT;||0
ValidateRgn|i|hWnd:&HWND;,hRgn:&HRGN;||0
VkKeyScanA|s|ch:c||0
VkKeyScanExA|s|ch:c,dwhkl:&HKL;||0
VkKeyScanExW|s|ch:w,dwhkl:&HKL;||0
VkKeyScanW|s|ch:w||0
WaitForInputIdle|m|hProcess:&HANDLE;,dwMilliseconds:m||0
WaitMessage|i|||0
WinHelpA|i|hWndMain:&HWND;,lpszHelp:^c,uCommand:u,dwData:r||0
WinHelpW|i|hWndMain:&HWND;,lpszHelp:^w,uCommand:u,dwData:r||0
WindowFromDC|&HWND;|hDC:&HDC;||0
keybd_event|v|bVk:h,bScan:h,dwFlags:m,dwExtraInfo:r||0
mouse_event|v|dwFlags:m,dx:m,dy:m,dwData:m,dwExtraInfo:r||0
wsprintfA|i|a1:*c,a2:^c|v|0
wsprintfW|i|a1:*w,a2:^w|v|0
wvsprintfA|i|a1:*c,a2:^c,arglist:x||0
wvsprintfW|i|a1:*w,a2:^w,arglist:x||0
`;var aa=Object.freeze({__proto__:null,data:ra,headers:ia,provenance:ta});const sa="mingw-w64 unknown include",na=["ws2tcpip.h","winsock2.h","ws2ipdef.h","psdk_inc/_fd_types.h"],oa=`&HANDLE=v
&HWND=@struct HWND__;
FreeAddrInfoEx|v|pAddrInfo:*@struct addrinfoexA;||0
FreeAddrInfoExW|v|pAddrInfo:*@struct addrinfoexW;||0
FreeAddrInfoW|v|pAddrInfo:*@struct addrinfoW;||0
GetAddrInfoExA|i|pName:^c,pServiceName:^c,dwNameSpace:m,lpNspId:*@GUID;,pHints:^@ADDRINFOEXA;,ppResult:**@struct addrinfoexA;,timeout:*@struct timeval;,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p,lpNameHandle:*&HANDLE;||0
GetAddrInfoExW|i|pName:^w,pServiceName:^w,dwNameSpace:m,lpNspId:*@GUID;,pHints:^@ADDRINFOEXW;,ppResult:**@struct addrinfoexW;,timeout:*@struct timeval;,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p,lpNameHandle:*&HANDLE;||0
GetAddrInfoW|i|pNodeName:^w,pServiceName:^w,pHints:^@ADDRINFOW;,ppResult:**@struct addrinfoW;||0
GetHostNameW|i|name:*w,namelen:i||1
GetNameInfoW|i|pSockaddr:^@SOCKADDR;,SockaddrLength:i,pNodeBuffer:*w,NodeBufferSize:m,pServiceBuffer:*w,ServiceBufferSize:m,Flags:i||0
IN6ADDR_ISANY|i|a:^@struct sockaddr_in6;||0
IN6ADDR_ISLOOPBACK|i|a:^@struct sockaddr_in6;||0
IN6ADDR_SETANY|v|a:*@struct sockaddr_in6;||0
IN6ADDR_SETLOOPBACK|v|a:*@struct sockaddr_in6;||0
IN6_ADDR_EQUAL|i|a:^@struct in6_addr;,b:^@struct in6_addr;||2
IN6_IS_ADDR_LINKLOCAL|i|a:^@struct in6_addr;||0
IN6_IS_ADDR_LOOPBACK|i|a:^@struct in6_addr;||0
IN6_IS_ADDR_MC_GLOBAL|i|a:^@struct in6_addr;||0
IN6_IS_ADDR_MC_LINKLOCAL|i|a:^@struct in6_addr;||0
IN6_IS_ADDR_MC_NODELOCAL|i|a:^@struct in6_addr;||0
IN6_IS_ADDR_MC_ORGLOCAL|i|a:^@struct in6_addr;||0
IN6_IS_ADDR_MC_SITELOCAL|i|a:^@struct in6_addr;||0
IN6_IS_ADDR_MULTICAST|i|a:^@struct in6_addr;||0
IN6_IS_ADDR_SITELOCAL|i|a:^@struct in6_addr;||0
IN6_IS_ADDR_UNSPECIFIED|i|a:^@struct in6_addr;||0
IN6_IS_ADDR_V4COMPAT|i|a:^@struct in6_addr;||0
IN6_IS_ADDR_V4MAPPED|i|a:^@struct in6_addr;||0
IN6_SET_ADDR_LOOPBACK|v|a:*@struct in6_addr;||0
IN6_SET_ADDR_UNSPECIFIED|v|a:*@struct in6_addr;||0
InetNtopW|^w|Family:i,pAddr:^v,pStringBuf:*w,StringBufSIze:z||0
InetPtonW|i|Family:i,pStringBuf:^w,pAddr:*v||0
SetAddrInfoExA|i|pName:^c,pServiceName:^c,pAddresses:*@SOCKET_ADDRESS;,dwAddressCount:m,lpBlob:*@struct _BLOB;,dwFlags:m,dwNameSpace:m,lpNspId:*@GUID;,timeout:*@struct timeval;,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p,lpNameHandle:*&HANDLE;||0
SetAddrInfoExW|i|pName:^w,pServiceName:^w,pAddresses:*@SOCKET_ADDRESS;,dwAddressCount:m,lpBlob:*@struct _BLOB;,dwFlags:m,dwNameSpace:m,lpNspId:*@GUID;,timeout:*@struct timeval;,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p,lpNameHandle:*&HANDLE;||0
WSAAccept|r|s:r,addr:*@struct sockaddr;,addrlen:*i,lpfnCondition:p,dwCallbackData:r||1
WSAAddressToStringA|i|lpsaAddress:*@struct sockaddr;,dwAddressLength:m,lpProtocolInfo:*@struct _WSAPROTOCOL_INFOA;,lpszAddressString:*c,lpdwAddressStringLength:*m||1
WSAAddressToStringW|i|lpsaAddress:*@struct sockaddr;,dwAddressLength:m,lpProtocolInfo:*@struct _WSAPROTOCOL_INFOW;,lpszAddressString:*w,lpdwAddressStringLength:*m||1
WSAAsyncGetHostByAddr|&HANDLE;|hWnd:&HWND;,wMsg:u,addr:^c,len:i,type:i,buf:*c,buflen:i||1
WSAAsyncGetHostByName|&HANDLE;|hWnd:&HWND;,wMsg:u,name:^c,buf:*c,buflen:i||1
WSAAsyncGetProtoByName|&HANDLE;|hWnd:&HWND;,wMsg:u,name:^c,buf:*c,buflen:i||1
WSAAsyncGetProtoByNumber|&HANDLE;|hWnd:&HWND;,wMsg:u,number:i,buf:*c,buflen:i||1
WSAAsyncGetServByName|&HANDLE;|hWnd:&HWND;,wMsg:u,name:^c,proto:^c,buf:*c,buflen:i||1
WSAAsyncGetServByPort|&HANDLE;|hWnd:&HWND;,wMsg:u,port:i,proto:^c,buf:*c,buflen:i||1
WSAAsyncSelect|i|s:r,hWnd:&HWND;,wMsg:u,lEvent:l||1
WSACancelAsyncRequest|i|hAsyncTaskHandle:&HANDLE;||1
WSACancelBlockingCall|i|||1
WSACleanup|i|||1
WSACloseEvent|i|hEvent:&HANDLE;||1
WSAConnect|i|s:r,name:^@struct sockaddr;,namelen:i,lpCallerData:*@struct _WSABUF;,lpCalleeData:*@struct _WSABUF;,lpSQOS:*@struct _QualityOfService;,lpGQOS:*@struct _QualityOfService;||1
WSAConnectByList|i|s:r,SocketAddressList:*@struct _SOCKET_ADDRESS_LIST;,LocalAddressLength:*m,LocalAddress:*@struct sockaddr;,RemoteAddressLength:*m,RemoteAddress:*@struct sockaddr;,timeout:^@TIMEVAL;,Reserved:*@struct _OVERLAPPED;||1
WSAConnectByNameA|i|s:r,nodename:*c,servicename:*c,LocalAddressLength:*m,LocalAddress:*@struct sockaddr;,RemoteAddressLength:*m,RemoteAddress:*@struct sockaddr;,timeout:^@TIMEVAL;,Reserved:*@struct _OVERLAPPED;||1
WSAConnectByNameW|i|s:r,nodename:*w,servicename:*w,LocalAddressLength:*m,LocalAddress:*@struct sockaddr;,RemoteAddressLength:*m,RemoteAddress:*@struct sockaddr;,timeout:^@TIMEVAL;,Reserved:*@struct _OVERLAPPED;||1
WSACreateEvent|&HANDLE;|||1
WSADuplicateSocketA|i|s:r,dwProcessId:m,lpProtocolInfo:*@struct _WSAPROTOCOL_INFOA;||1
WSADuplicateSocketW|i|s:r,dwProcessId:m,lpProtocolInfo:*@struct _WSAPROTOCOL_INFOW;||1
WSAEnumNameSpaceProvidersA|i|lpdwBufferLength:*m,lpnspBuffer:*@struct _WSANAMESPACE_INFOA;||1
WSAEnumNameSpaceProvidersExA|i|lpdwBufferLength:*m,lpnspBuffer:*@struct _WSANAMESPACE_INFOEXA;||1
WSAEnumNameSpaceProvidersExW|i|lpdwBufferLength:*m,lpnspBuffer:*@struct _WSANAMESPACE_INFOEXW;||1
WSAEnumNameSpaceProvidersW|i|lpdwBufferLength:*m,lpnspBuffer:*@struct _WSANAMESPACE_INFOW;||1
WSAEnumNetworkEvents|i|s:r,hEventObject:&HANDLE;,lpNetworkEvents:*@struct _WSANETWORKEVENTS;||1
WSAEnumProtocolsA|i|lpiProtocols:*i,lpProtocolBuffer:*@struct _WSAPROTOCOL_INFOA;,lpdwBufferLength:*m||1
WSAEnumProtocolsW|i|lpiProtocols:*i,lpProtocolBuffer:*@struct _WSAPROTOCOL_INFOW;,lpdwBufferLength:*m||1
WSAEventSelect|i|s:r,hEventObject:&HANDLE;,lNetworkEvents:l||1
WSAGetLastError|i|||1
WSAGetOverlappedResult|i|s:r,lpOverlapped:*@struct _OVERLAPPED;,lpcbTransfer:*m,fWait:i,lpdwFlags:*m||1
WSAGetQOSByName|i|s:r,lpQOSName:*@struct _WSABUF;,lpQOS:*@struct _QualityOfService;||1
WSAGetServiceClassInfoA|i|lpProviderId:*@GUID;,lpServiceClassId:*@GUID;,lpdwBufSize:*m,lpServiceClassInfo:*@struct _WSAServiceClassInfoA;||1
WSAGetServiceClassInfoW|i|lpProviderId:*@GUID;,lpServiceClassId:*@GUID;,lpdwBufSize:*m,lpServiceClassInfo:*@struct _WSAServiceClassInfoW;||1
WSAGetServiceClassNameByClassIdA|i|lpServiceClassId:*@GUID;,lpszServiceClassName:*c,lpdwBufferLength:*m||1
WSAGetServiceClassNameByClassIdW|i|lpServiceClassId:*@GUID;,lpszServiceClassName:*w,lpdwBufferLength:*m||1
WSAHtonl|i|s:r,hostlong:m,lpnetlong:*m||1
WSAHtons|i|s:r,hostshort:t,lpnetshort:*t||1
WSAInstallServiceClassA|i|lpServiceClassInfo:*@struct _WSAServiceClassInfoA;||1
WSAInstallServiceClassW|i|lpServiceClassInfo:*@struct _WSAServiceClassInfoW;||1
WSAIoctl|i|s:r,dwIoControlCode:m,lpvInBuffer:*v,cbInBuffer:m,lpvOutBuffer:*v,cbOutBuffer:m,lpcbBytesReturned:*m,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p||1
WSAIsBlocking|i|||1
WSAJoinLeaf|r|s:r,name:^@struct sockaddr;,namelen:i,lpCallerData:*@struct _WSABUF;,lpCalleeData:*@struct _WSABUF;,lpSQOS:*@struct _QualityOfService;,lpGQOS:*@struct _QualityOfService;,dwFlags:m||1
WSALookupServiceBeginA|i|lpqsRestrictions:*@struct _WSAQuerySetA;,dwControlFlags:m,lphLookup:*&HANDLE;||1
WSALookupServiceBeginW|i|lpqsRestrictions:*@struct _WSAQuerySetW;,dwControlFlags:m,lphLookup:*&HANDLE;||1
WSALookupServiceEnd|i|hLookup:&HANDLE;||1
WSALookupServiceNextA|i|hLookup:&HANDLE;,dwControlFlags:m,lpdwBufferLength:*m,lpqsResults:*@struct _WSAQuerySetA;||1
WSALookupServiceNextW|i|hLookup:&HANDLE;,dwControlFlags:m,lpdwBufferLength:*m,lpqsResults:*@struct _WSAQuerySetW;||1
WSANSPIoctl|i|hLookup:&HANDLE;,dwControlCode:m,lpvInBuffer:*v,cbInBuffer:m,lpvOutBuffer:*v,cbOutBuffer:m,lpcbBytesReturned:*m,lpCompletion:*@struct _WSACOMPLETION;||1
WSANtohl|i|s:r,netlong:m,lphostlong:*m||1
WSANtohs|i|s:r,netshort:t,lphostshort:*t||1
WSAPoll|i|fdarray:*@WSAPOLLFD;,nfds:m,timeout:i||1
WSAProviderConfigChange|i|lpNotificationHandle:*&HANDLE;,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p||1
WSARecv|i|s:r,lpBuffers:*@struct _WSABUF;,dwBufferCount:m,lpNumberOfBytesRecvd:*m,lpFlags:*m,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p||1
WSARecvDisconnect|i|s:r,lpInboundDisconnectData:*@struct _WSABUF;||1
WSARecvFrom|i|s:r,lpBuffers:*@struct _WSABUF;,dwBufferCount:m,lpNumberOfBytesRecvd:*m,lpFlags:*m,lpFrom:*@struct sockaddr;,lpFromlen:*i,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p||1
WSARemoveServiceClass|i|lpServiceClassId:*@GUID;||1
WSAResetEvent|i|hEvent:&HANDLE;||1
WSASend|i|s:r,lpBuffers:*@struct _WSABUF;,dwBufferCount:m,lpNumberOfBytesSent:*m,dwFlags:m,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p||1
WSASendDisconnect|i|s:r,lpOutboundDisconnectData:*@struct _WSABUF;||1
WSASendMsg|i|s:r,lpMsg:*@struct _WSAMSG;,dwFlags:m,lpNumberOfBytesSent:*m,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p||1
WSASendTo|i|s:r,lpBuffers:*@struct _WSABUF;,dwBufferCount:m,lpNumberOfBytesSent:*m,dwFlags:m,lpTo:^@struct sockaddr;,iTolen:i,lpOverlapped:*@struct _OVERLAPPED;,lpCompletionRoutine:p||1
WSASetBlockingHook|p|lpBlockFunc:p||1
WSASetEvent|i|hEvent:&HANDLE;||1
WSASetLastError|v|iError:i||1
WSASetServiceA|i|lpqsRegInfo:*@struct _WSAQuerySetA;,essoperation:u,dwControlFlags:m||1
WSASetServiceW|i|lpqsRegInfo:*@struct _WSAQuerySetW;,essoperation:u,dwControlFlags:m||1
WSASocketA|r|af:i,type:i,protocol:i,lpProtocolInfo:*@struct _WSAPROTOCOL_INFOA;,g:u,dwFlags:m||1
WSASocketW|r|af:i,type:i,protocol:i,lpProtocolInfo:*@struct _WSAPROTOCOL_INFOW;,g:u,dwFlags:m||1
WSAStartup|i|wVersionRequested:t,lpWSAData:*@struct WSAData;||1
WSAStringToAddressA|i|AddressString:*c,AddressFamily:i,lpProtocolInfo:*@struct _WSAPROTOCOL_INFOA;,lpAddress:*@struct sockaddr;,lpAddressLength:*i||1
WSAStringToAddressW|i|AddressString:*w,AddressFamily:i,lpProtocolInfo:*@struct _WSAPROTOCOL_INFOW;,lpAddress:*@struct sockaddr;,lpAddressLength:*i||1
WSAUnhookBlockingHook|i|||1
WSAWaitForMultipleEvents|m|cEvents:m,lphEvents:^&HANDLE;,fWaitAll:i,dwTimeout:m,fAlertable:i||1
__WSAFDIsSet|i|a1:r,a2:*@fd_set;||3
accept|r|s:r,addr:*@struct sockaddr;,addrlen:*i||1
bind|i|s:r,name:^@struct sockaddr;,namelen:i||1
closesocket|i|s:r||1
connect|i|s:r,name:^@struct sockaddr;,namelen:i||1
freeaddrinfo|v|pAddrInfo:*@ADDRINFOA;||0
gai_strerrorA|*c|a1:i||0
gai_strerrorW|*w|a1:i||0
getaddrinfo|i|nodename:^c,servname:^c,hints:^@struct addrinfo;,res:**@struct addrinfo;||0
gethostbyaddr|*@struct hostent;|addr:^c,len:i,type:i||1
gethostbyname|*@struct hostent;|name:^c||1
gethostname|i|name:*c,namelen:i||1
getnameinfo|i|sa:^@struct sockaddr;,salen:i,host:*c,hostlen:m,serv:*c,servlen:m,flags:i||0
getpeername|i|s:r,name:*@struct sockaddr;,namelen:*i||1
getprotobyname|*@struct protoent;|name:^c||1
getprotobynumber|*@struct protoent;|number:i||1
getservbyname|*@struct servent;|name:^c,proto:^c||1
getservbyport|*@struct servent;|port:i,proto:^c||1
getsockname|i|s:r,name:*@struct sockaddr;,namelen:*i||1
getsockopt|i|s:r,level:i,optname:i,optval:*c,optlen:*i||1
htonl|m|hostlong:m||1
htons|t|hostshort:t||1
inet_addr|m|cp:^c||1
inet_ntop|^c|Family:i,pAddr:^v,pStringBuf:*c,StringBufSize:z||0
inet_pton|i|Family:i,pStringBuf:^c,pAddr:*v||0
ioctlsocket|i|s:r,cmd:l,argp:*m||1
listen|i|s:r,backlog:i||1
ntohl|m|netlong:m||1
ntohs|t|netshort:t||1
recv|i|s:r,buf:*c,len:i,flags:i||1
recvfrom|i|s:r,buf:*c,len:i,flags:i,from:*@struct sockaddr;,fromlen:*i||1
select|i|nfds:i,readfds:*@fd_set;,writefds:*@fd_set;,exceptfds:*@fd_set;,timeout:^@TIMEVAL;||1
send|i|s:r,buf:^c,len:i,flags:i||1
sendto|i|s:r,buf:^c,len:i,flags:i,to:^@struct sockaddr;,tolen:i||1
setsockopt|i|s:r,level:i,optname:i,optval:^c,optlen:i||1
shutdown|i|s:r,how:i||1
socket|r|af:i,type:i,protocol:i||1
`;var ca=Object.freeze({__proto__:null,data:oa,headers:na,provenance:sa});const oi={c:Sr,posix:Hr,darwin:Dr,glibc:Pr,cxx:Tr,corefoundation:Rr,"windows-crt":Yr,"windows-kernel":$r,"windows-user":aa,"windows-advapi":Br,"windows-winsock":ca,"windows-shell":ea};class ci{library;module;lines=new Map;handles=new Map;decoded=new Map;types=new Map;variableLines=new Map;constructor(e,t){this.library=e,this.module=t;let i=0;const{data:a}=t;for(;i<a.length;){let r=a.indexOf(`
`,i);if(r<0&&(r=a.length),r>i)if(a.charCodeAt(i)===38){const n=a.indexOf("=",i);this.handles.set(a.slice(i+1,n),a.slice(n+1,r))}else if(a.charCodeAt(i)===61){const n=a.indexOf("|",i);this.variableLines.set(a.slice(i+1,n),a.slice(n+1,r))}else{const n=a.indexOf("|",i);this.lines.set(a.slice(i,n),a.slice(n+1,r))}i=r+1}}names(){return this.lines.keys()}entry(e){if(this.decoded.has(e))return this.decoded.get(e);const t=this.lines.get(e),i=t===void 0?void 0:this.decode(t);return this.decoded.set(e,i),i}variable(e){const t=this.variableLines.get(e);if(t===void 0)return;const[i,a,r]=t.split("|");return{library:this.library,type:this.type(i),constant:a.includes("c"),source:`${this.module.provenance} ${this.module.headers[Number.parseInt(r,36)]}`}}decode(e){const[t,i,a,r]=e.split("|");let n;for(const o of a.matchAll(/([fso])(\d+)/g))n={kind:o[1]==="f"?"format":o[1]==="s"?"scanf_format":"open_flags",argument:Number(o[2])};return{library:this.library,returns:this.type(t),parameters:i?i.split(",").map(o=>{const c=o.indexOf(":");return[o.slice(0,c),this.type(o.slice(c+1))]}):[],...a.includes("n")?{noreturn:!0}:{},...a.includes("v")?{variadic:!0}:{},...n?{variadic_rule:n}:{},.../a\d/.test(a)?{allocates:[...a.matchAll(/a(\d+)/g)].map(o=>Number(o[1]))}:{},source:`${this.module.provenance} ${this.module.headers[Number.parseInt(r,36)]}`}}type(e){const t=this.types.get(e);if(t!==void 0)return t;const i={at:0},a=this.parse(e,i);if(i.at!==e.length)throw new TypeError(`Malformed generated type code ${e}`);return this.types.set(e,a),a}parse(e,t){const i=e[t.at++],a=()=>{const r=e.indexOf(";",t.at),n=e.slice(t.at,r);return t.at=r+1,n};switch(i){case"*":return{kind:"pointer",to:this.parse(e,t)};case"^":return{kind:"pointer",to:this.parse(e,t),const:!0};case"@":{const r=a();return r.startsWith("!")?{kind:"opaque",name:r.slice(1),spelled:!1}:{kind:"opaque",name:r}}case"$":{const r=a();if(!Object.hasOwn(pr,r))throw new TypeError(`Unknown ABI typedef ${r}`);return r}case"&":{const r=a(),n=this.handles.get(r);if(n===void 0)throw new TypeError(`Unknown handle typedef ${r}`);return{kind:"handle",name:r,to:this.type(n)}}default:{const r=ni[i];if(r===void 0)throw new TypeError(`Unknown generated type code ${i}`);return r}}}}const be=new Map;function la(s,e){let t=be.get(s);if(t===void 0){const i=oi[s];t=i?new ci(s,i):null,be.set(s,t)}return t?.entry(e)}function _a(s,e){let t=be.get(s);if(t===void 0){const i=oi[s];t=i?new ci(s,i):null,be.set(s,t)}return t?.variable(e)}const x=s=>({kind:"pointer",to:s}),g=x("void"),N=x("char"),Ht=x("wchar"),Se=x(N),ua=x("int"),zt=x("uint"),te=x({kind:"opaque",name:"FILE"}),ge="fnptr",Wt=x({kind:"opaque",name:"OVERLAPPED"}),R=(s,e,t={kind:"unknown"})=>({argument:s,access:e,extent:t}),H=s=>({kind:"argument",index:s}),V=s=>({kind:"constant",bytes:s}),da="https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf",ma="https://pubs.opengroup.org/onlinepubs/9799919799/idx/functions.html",pa="https://github.com/apple-oss-distributions/Libc",fa="https://learn.microsoft.com/en-us/cpp/c-runtime-library/reference/crt-alphabetical-function-reference",Ca="https://learn.microsoft.com/en-us/windows/win32/api/";function E(s,e,t,i={}){return{library:s,returns:e,parameters:t,source:s==="c"?da:s==="posix"?ma:s==="windows-crt"?fa:s==="windows-kernel"?Ca:pa,...i}}const ha="https://github.com/apple-oss-distributions/objc4";function v(s,e,t={}){return E("objc",s,e,{source:ha,...t})}const Ee=[["self",g],["selector",g],["value",g],["offset","long"]],Fe="https://gcc.gnu.org/git/?p=gcc.git;a=blob;f=libstdc%2B%2B-v3/include/bits/functexcept.h";function Sa(){const s=()=>E("cxx","void",[["message",N]],{noreturn:!0,source:Fe}),e=()=>E("cxx","void",[],{noreturn:!0,source:Fe});return{_ZSt17__throw_bad_allocv:e(),_ZSt16__throw_bad_castv:e(),_ZSt25__throw_bad_function_callv:e(),_ZSt28__throw_bad_array_new_lengthv:e(),_ZSt19__throw_logic_errorPKc:s(),_ZSt20__throw_length_errorPKc:s(),_ZSt20__throw_out_of_rangePKc:s(),_ZSt24__throw_invalid_argumentPKc:s(),_ZSt21__throw_runtime_errorPKc:s(),_ZSt24__throw_out_of_range_fmtPKcz:E("cxx","void",[["format",N]],{noreturn:!0,variadic:!0,source:Fe}),_ZSt20__throw_system_errori:E("cxx","void",[["code","int"]],{noreturn:!0,source:Fe})}}const Ut={exit:E("c","void",[["status","int"]],{noreturn:!0}),_Exit:E("c","void",[["status","int"]],{noreturn:!0}),quick_exit:E("c","void",[["status","int"]],{noreturn:!0}),abort:E("c","void",[],{noreturn:!0}),_exit:E("posix","void",[["status","int"]],{noreturn:!0}),__assert_rtn:E("darwin","void",[["function",N],["file",N],["line","int"],["expression",N]],{noreturn:!0,memory:[R(0,"read"),R(1,"read"),R(3,"read")]}),__stack_chk_fail:E("darwin","void",[],{noreturn:!0}),__cxa_throw:E("cxx","void",[["exception",g],["type_info",g],["destructor",ge]],{noreturn:!0,source:"https://itanium-cxx-abi.github.io/cxx-abi/abi-eh.html"}),__cxa_rethrow:E("cxx","void",[],{noreturn:!0,source:"https://itanium-cxx-abi.github.io/cxx-abi/abi-eh.html"}),_ZSt9terminatev:E("cxx","void",[],{noreturn:!0,source:"https://github.com/llvm/llvm-project/tree/main/libcxxabi"}),...Sa(),objc_exception_throw:E("objc","void",[["exception",g]],{noreturn:!0,source:"https://github.com/apple-oss-distributions/objc4"}),malloc:E("c",g,[["size","size_t"]],{allocates:[0]}),calloc:E("c",g,[["count","size_t"],["size","size_t"]],{allocates:[0,1]}),realloc:E("c",g,[["pointer",g],["size","size_t"]],{memory:[R(0,"read_write")],allocates:[1]}),free:E("c","void",[["pointer",g]],{memory:[R(0,"read_write")]}),memcpy:E("c",g,[["destination",g],["source",g],["size","size_t"]],{memory:[R(0,"write",H(2)),R(1,"read",H(2))],captures:[],returns_argument:0}),memmove:E("c",g,[["destination",g],["source",g],["size","size_t"]],{memory:[R(0,"write",H(2)),R(1,"read",H(2))],captures:[],returns_argument:0}),memset:E("c",g,[["destination",g],["value","int"],["size","size_t"]],{memory:[R(0,"write",H(2))],captures:[],returns_argument:0}),memcmp:E("c","int",[["left",g],["right",g],["size","size_t"]],{memory:[R(0,"read",H(2)),R(1,"read",H(2))],captures:[]}),strlen:E("c","size_t",[["string",N]],{memory:[R(0,"read")],captures:[]}),strcmp:E("c","int",[["left",N],["right",N]],{memory:[R(0,"read"),R(1,"read")],captures:[]}),strncmp:E("c","int",[["left",N],["right",N],["size","size_t"]],{memory:[R(0,"read",H(2)),R(1,"read",H(2))],captures:[]}),strchr:E("c",N,[["s",N],["c","int"]],{memory:[R(0,"read")],captures:[],character:[1]}),strrchr:E("c",N,[["s",N],["c","int"]],{memory:[R(0,"read")],captures:[],character:[1]}),memchr:E("c",g,[["s",g],["c","int"],["n","size_t"]],{memory:[R(0,"read",H(2))],captures:[],character:[1]}),...Object.fromEntries(["isalnum","isalpha","isblank","iscntrl","isdigit","isgraph","islower","isprint","ispunct","isspace","isupper","isxdigit","tolower","toupper"].map(s=>[s,E("c","int",[["c","int"]],{captures:[],character:[0]})])),putchar:E("c","int",[["c","int"]],{character:[0]}),fputc:E("c","int",[["c","int"],["stream",te]],{memory:[R(1,"read_write")],character:[0]}),putc:E("c","int",[["c","int"],["stream",te]],{memory:[R(1,"read_write")],character:[0]}),ungetc:E("c","int",[["c","int"],["stream",te]],{memory:[R(1,"read_write")],character:[0]}),puts:E("c","int",[["string",N]],{memory:[R(0,"read")]}),printf:E("c","int",[["format",N]],{memory:[R(0,"read")],variadic:!0,variadic_rule:{kind:"format",argument:0}}),fprintf:E("c","int",[["stream",te],["format",N]],{memory:[R(0,"read_write"),R(1,"read")],variadic:!0,variadic_rule:{kind:"format",argument:1}}),fopen:E("c",te,[["path",N],["mode",N]],{memory:[R(0,"read"),R(1,"read")]}),fdopen:E("posix",te,[["descriptor","int"],["mode",N]],{memory:[R(1,"read")]}),fclose:E("c","int",[["stream",te]],{memory:[R(0,"read_write")]}),snprintf:E("c","int",[["buffer",N],["size","size_t"],["format",N]],{memory:[R(0,"write",H(1)),R(2,"read")],variadic:!0,variadic_rule:{kind:"format",argument:2}}),read:E("posix","ssize_t",[["descriptor","int"],["buffer",g],["size","size_t"]],{memory:[R(1,"write",H(2))]}),write:E("posix","ssize_t",[["descriptor","int"],["buffer",g],["size","size_t"]],{memory:[R(1,"read",H(2))]}),open:E("posix","int",[["path",N],["flags","int"]],{memory:[R(0,"read")],variadic:!0,variadic_rule:{kind:"open_flags",argument:1}}),close:E("posix","int",[["descriptor","int"]]),fcntl:E("posix","int",[["descriptor","int"],["command","int"]],{variadic:!0,variadic_rule:{kind:"fcntl_command",argument:1}}),ioctl:E("posix","int",[["descriptor","int"],["request","ulong"]],{variadic:!0,variadic_rule:{kind:"ioctl_command",argument:1}}),getopt:E("posix","int",[["argc","int"],["argv",Se],["options",N]],{memory:[R(1,"read"),R(2,"read")]}),atoi:E("c","int",[["string",N]],{memory:[R(0,"read")],captures:[]}),strtol:E("c","long",[["string",N],["end",Se],["base","int"]],{memory:[R(0,"read"),R(1,"write",V(8n))]}),strtoul:E("c","ulong",[["string",N],["end",Se],["base","int"]],{memory:[R(0,"read"),R(1,"write",V(8n))]}),labs:E("c","long",[["value","long"]]),getenv:E("c",N,[["name",N]],{memory:[R(0,"read")]}),strdup:E("posix",N,[["string",N]],{memory:[R(0,"read")]}),perror:E("c","void",[["message",N]],{memory:[R(0,"read")]}),fork:E("posix","int",[]),setsid:E("posix","int",[]),waitpid:E("posix","int",[["pid","int"],["status",ua],["options","int"]],{memory:[R(1,"write",V(4n))]}),pselect:E("darwin","int",[["nfds","int"],["readfds",g],["writefds",g],["exceptfds",g],["timeout",g],["sigmask",g]],{memory:[R(1,"read_write",V(128n)),R(2,"read_write",V(128n)),R(3,"read_write",V(128n)),R(4,"read",V(16n)),R(5,"read",V(4n))]}),grantpt:E("posix","int",[["descriptor","int"]]),unlockpt:E("posix","int",[["descriptor","int"]]),ptsname:E("posix",N,[["descriptor","int"]]),execvp:E("posix","int",[["file",N],["argv",Se]],{memory:[R(0,"read"),R(1,"read")]}),signal:E("c",ge,[["number","int"],["handler",ge]],{captures:[1]}),sigprocmask:E("darwin","int",[["how","int"],["set",g],["oldset",g]],{memory:[R(1,"read",V(4n)),R(2,"write",V(4n))]}),sigemptyset:E("darwin","int",[["set",g]],{memory:[R(0,"write",V(4n))]}),sigaddset:E("darwin","int",[["set",g],["number","int"]],{memory:[R(0,"read_write",V(4n))]}),__darwin_check_fd_set_overflow:E("darwin","int",[["descriptor","int"],["set",g],["unlimited","int"]]),objc_retain:v(g,[["object",g]],{returns_argument:0}),objc_release:v("void",[["object",g]]),objc_autorelease:v(g,[["object",g]],{returns_argument:0}),objc_autoreleaseReturnValue:v(g,[["object",g]],{returns_argument:0}),objc_retainAutorelease:v(g,[["object",g]],{returns_argument:0}),objc_retainAutoreleaseReturnValue:v(g,[["object",g]],{returns_argument:0}),objc_retainAutoreleasedReturnValue:v(g,[["object",g]],{returns_argument:0}),objc_claimAutoreleasedReturnValue:v(g,[["object",g]],{returns_argument:0}),objc_unsafeClaimAutoreleasedReturnValue:v(g,[["object",g]],{returns_argument:0}),objc_retainBlock:v(g,[["block",g]]),objc_storeStrong:v("void",[["location",x(g)],["object",g]]),objc_loadWeakRetained:v(g,[["location",x(g)]]),objc_loadWeak:v(g,[["location",x(g)]]),objc_storeWeak:v(g,[["location",x(g)],["object",g]]),objc_initWeak:v(g,[["location",x(g)],["object",g]]),objc_destroyWeak:v("void",[["location",x(g)]]),objc_copyWeak:v("void",[["destination",x(g)],["source",x(g)]]),objc_moveWeak:v("void",[["destination",x(g)],["source",x(g)]]),objc_autoreleasePoolPush:v(g,[]),objc_autoreleasePoolPop:v("void",[["pool",g]]),objc_alloc:v(g,[["cls",g]]),objc_alloc_init:v(g,[["cls",g]]),objc_opt_new:v(g,[["cls",g]]),objc_opt_class:v(g,[["object",g]]),objc_opt_self:v(g,[["object",g]]),objc_opt_isKindOfClass:v("char",[["object",g],["cls",g]]),objc_opt_respondsToSelector:v("char",[["object",g],["selector",g]]),objc_getClass:v(g,[["name",N]],{memory:[R(0,"read")]}),objc_lookUpClass:v(g,[["name",N]],{memory:[R(0,"read")]}),objc_enumerationMutation:v("void",[["object",g]]),objc_sync_enter:v("int",[["object",g]]),objc_sync_exit:v("int",[["object",g]]),objc_setProperty_atomic:v("void",Ee),objc_setProperty_nonatomic:v("void",Ee),objc_setProperty_atomic_copy:v("void",Ee),objc_setProperty_nonatomic_copy:v("void",Ee),swift_task_alloc:E("swift-concurrency",g,[["size","size_t"]],{source:"https://github.com/swiftlang/swift/tree/main/include/swift/Runtime"}),swift_task_dealloc:E("swift-concurrency","void",[["pointer",g]],{source:"https://github.com/swiftlang/swift/tree/main/include/swift/Runtime"}),swift_errorRetain:E("swift-core",g,[["error",g]],{returns_argument:0,source:"https://github.com/swiftlang/swift/tree/main/include/swift/Runtime"}),swift_errorRelease:E("swift-core","void",[["error",g]],{source:"https://github.com/swiftlang/swift/tree/main/include/swift/Runtime"}),_read:E("windows-crt","int",[["descriptor","int"],["buffer",g],["count","uint"]],{memory:[R(1,"write",H(2))]}),_write:E("windows-crt","int",[["descriptor","int"],["buffer",g],["count","uint"]],{memory:[R(1,"read",H(2))]}),_open:E("windows-crt","int",[["path",N],["flags","int"]],{memory:[R(0,"read")],variadic:!0,variadic_rule:{kind:"open_flags",argument:1}}),_close:E("windows-crt","int",[["descriptor","int"]]),_strdup:E("windows-crt",N,[["string",N]],{memory:[R(0,"read")]}),ExitProcess:E("windows-kernel","void",[["exit_code","uint"]],{noreturn:!0}),GetModuleHandleW:E("windows-kernel",g,[["name",Ht]],{memory:[R(0,"read")]}),LoadLibraryW:E("windows-kernel",g,[["name",Ht]],{memory:[R(0,"read")]}),GetProcAddress:E("windows-kernel",ge,[["module",g],["name",N]],{memory:[R(1,"read")]}),ReadFile:E("windows-kernel","int",[["file",g],["buffer",g],["count","uint"],["read",zt],["overlapped",Wt]],{memory:[R(1,"write",H(2)),R(3,"write",V(4n)),R(4,"read_write")]}),WriteFile:E("windows-kernel","int",[["file",g],["buffer",g],["count","uint"],["written",zt],["overlapped",Wt]],{memory:[R(1,"read",H(2)),R(3,"write",V(4n)),R(4,"read_write")]})},ga=/^(?:ucrtbase|msvcrt|msvcr\d+|vcruntime\d+(?:_\d+)?|api-ms-win-crt-[a-z0-9-]+)\.dll$/,Ea=/^(?:libc|libm|libpthread|libdl|librt|libutil)\.so\.\d+$/,Fa=/^\/usr\/lib\/(?:libSystem(?:\.B)?\.dylib|system\/lib[A-Za-z0-9_]+\.dylib)$/;function nt(s,e,t){if(t==="pe"){const i=s.toLowerCase();switch(e){case"windows-kernel":return i==="kernel32.dll"||i==="kernelbase.dll"||/^api-ms-win-(?:core|eventing)-[a-z0-9-]+\.dll$/.test(i);case"windows-user":return i==="user32.dll";case"windows-advapi":return i==="advapi32.dll"||/^api-ms-win-security-[a-z0-9-]+\.dll$/.test(i);case"windows-winsock":return i==="ws2_32.dll"||i==="wsock32.dll";case"windows-shell":return i==="shell32.dll";case"c":case"windows-crt":return ga.test(i);default:return!1}}if(t==="elf"){const i=s.slice(s.lastIndexOf("/")+1);return e==="c"||e==="posix"||e==="glibc"?Ea.test(i):e==="cxx"?i==="libstdc++.so.6"||i==="libc++abi.so.1"||i==="libgcc_s.so.1":!1}switch(e){case"c":case"posix":case"darwin":return Fa.test(s);case"cxx":return/^\/usr\/lib\/libc\+\+(abi)?(?:\.\d+)*\.dylib$/.test(s);case"objc":return/^\/usr\/lib\/libobjc(?:\.A|\.\d+)*\.dylib$/.test(s);case"corefoundation":return/^\/System\/Library\/Frameworks\/CoreFoundation\.framework\/(?:Versions\/[A-Z]\/)?CoreFoundation$/.test(s);case"swift-core":return s==="/usr/lib/swift/libswiftCore.dylib";case"swift-concurrency":return s==="/usr/lib/swift/libswift_Concurrency.dylib";default:return!1}}function Ra(s,e,t){return nt(s,e.library,t)}const li=["c","posix","darwin","glibc","cxx","objc","corefoundation","swift-core","swift-concurrency","windows-crt","windows-kernel","windows-user","windows-advapi","windows-winsock","windows-shell"];function Ia(s,e,t){const i=Object.hasOwn(Ut,s)?Ut[s]:void 0;if(i&&Ra(e,i,t))return i;for(const a of li){if(!nt(e,a,t))continue;const r=la(a,s);if(r)return r}}function Ys(s,e,t){for(const i of li){if(!nt(e,i,t))continue;const a=_a(i,s);if(a)return a}}function js(s,e){const t=[];for(const i of["macho","pe","elf"]){const a=Ia(s,e,i);a&&!t.includes(a)&&t.push(a)}return t}const Ke={max_records:1e5,max_entries:1e5,max_depth:64,max_string_bytes:4096,max_total_string_bytes:8*1024*1024};class A extends Error{code;address;constructor(e,t,i){super(t),this.code=e,this.address=i}}const Aa=new TextDecoder("utf-8",{fatal:!0,ignoreBOM:!0});class wa{image;revision;context;records=[];symbols=[];evidence=[];diagnostics=[];sections;limits;encrypted=[];fixups=new Map;externalClasses=new Map;importSlots=new Map;importEntries=new Map;requireFixup;seen=new Set;stringBytes=0;partial=!1;constructor(e,t,i,a){this.image=e,this.revision=t,this.context=i,this.limits={...Ke,...a};for(const o of Object.keys(Ke))if(!Number.isSafeInteger(this.limits[o])||this.limits[o]<0||this.limits[o]>Ke[o])throw new RangeError("Invalid runtime metadata bounds");this.sections=e.sections.filter(o=>o.kind==="section"&&o.virtual_range.size>0n).sort((o,c)=>o.virtual_range.start.value<c.virtual_range.start.value?-1:1);const r=e.slices.find(o=>o.id===e.selected_slice_id);if(!r)throw new TypeError("Runtime image lacks its selected slice");for(const o of e.headers){if(i.checkpoint(1),o.name!=="LC_ENCRYPTION_INFO"&&o.name!=="LC_ENCRYPTION_INFO_64")continue;const c=o.range.start.value;if(o.range.start.space!=="file"||o.range.size<20n)throw new TypeError("Invalid encryption command record");const _=e.bytes.u32(c+8n),u=e.bytes.u32(c+12n);e.bytes.u32(c+16n)&&u&&this.encrypted.push({start:r.offset+BigInt(_),end:r.offset+BigInt(_)+BigInt(u)})}for(const o of e.relocations){if(i.checkpoint(1),o.width_bits!==64||o.kind==="relocation")continue;const c=e.address_map.translate(o.address,"va");if(c.kind!=="mapped")continue;const _=o.target===null?null:e.address_map.translate(o.target,"va").address.value,u=o.symbol_id!==null,d=this.fixups.get(c.address.value),h=[...new Set([...d?.evidence_ids??[],...o.evidence_ids])];if(h.length>1e3)throw new A("resource_limit","Runtime fixup evidence bound reached",c.address.value);this.fixups.set(c.address.value,{target:_,external:u,conflicting:d?.conflicting===!0||d!==void 0&&(d.target!==_||d.external!==u),evidence_ids:h})}const n=(o,c,_)=>{const u=o.get(c);o.set(c,u===void 0||u===_?_:null)};for(const o of e.imports){if(i.checkpoint(1),!o.original_name)continue;if(o.callable_entry){const u=e.address_map.translate(o.callable_entry,"va");u.kind==="mapped"&&n(this.importEntries,u.address.value,o.original_name)}if(!o.slot)continue;const c=e.address_map.translate(o.slot,"va");if(c.kind!=="mapped")continue;n(this.importSlots,c.address.value,o.original_name);const _=["_OBJC_CLASS_$_","_OBJC_METACLASS_$_"].find(u=>o.original_name.startsWith(u));_&&n(this.externalClasses,c.address.value,o.original_name.slice(_.length))}this.requireFixup=e.headers.some(o=>o.name==="LC_DYLD_CHAINED_FIXUPS")||e.diagnostics.length!==0}address(e){return{image_id:this.image.id,space:"va",value:e}}plus(e,t){const i=e+t;if(i<0n||i>=1n<<64n)throw new A("malformed_image","Runtime metadata address overflows",e);return i}section(e,t=1n){this.context.checkpoint(1);const i=e+t;if(e<0n||t<=0n||i>1n<<64n)throw new A("malformed_image","Runtime metadata range overflows",e);let a=0,r=this.sections.length;for(;a<r;){const o=a+r>>>1;this.sections[o].virtual_range.start.value<=e?a=o+1:r=o}const n=this.sections[a-1];if(!n||t<=0n||i>n.virtual_range.start.value+n.virtual_range.size||!n.permissions.includes("read"))throw new A("malformed_image","Runtime metadata exceeds a readable declared section",e);return n}file(e,t){this.section(e,t);const i=this.image.address_map.spans(this.address(e),t),a=i[0];if(i.length!==1||a?.kind!=="mapped"||a.file_offset===null||a.range.size!==t)throw new A("malformed_image","Runtime metadata lacks contiguous file backing",e);if(this.encrypted.some(r=>a.file_offset<r.end&&r.start<a.file_offset+t))throw new A("unavailable_semantics","Encrypted runtime metadata is unavailable",e);return a.file_offset}u32(e){return this.image.bytes.u32(this.file(e,4n))}u16(e){const t=this.file(e,2n);return this.image.bytes.at(Number(t))|this.image.bytes.at(Number(t+1n))<<8}u64(e){return this.image.bytes.u64(this.file(e,8n))}pointer(e){const t=this.file(e,8n),i=this.fixups.get(e);if(i?.conflicting)throw new A("unavailable_semantics","Conflicting runtime pointer fixups",e);if(i?.external)throw new A("unavailable_semantics","External runtime pointer binding has no local object bytes",e);if(i){if(i.target===null)throw new A("unavailable_semantics","Runtime pointer fixup has no decoded target",e);return i.target===0n?null:i.target}const a=this.image.bytes.u64(t);if(a===0n)return null;if(this.requireFixup)throw new A("unavailable_semantics","Runtime pointer has no established decoding",e);return a}relative(e,t=!1){const i=this.u32(e)|0;if(i===0)return null;const a=t&&(i&1)!==0,r=this.plus(e,BigInt(t?i&-2:i));return a?this.pointer(r):r}text(e,t=!1,i=!1){const a=this.section(e),r=a.virtual_range.start.value+a.virtual_range.size-e,n=r<BigInt(this.limits.max_string_bytes+1)?r:BigInt(this.limits.max_string_bytes+1),o=this.image.address_map.spans(this.address(e),n)[0];if(o?.kind!=="mapped"||o.file_offset===null)throw new A("malformed_image","Runtime string lacks file backing",e);let c=Number(o.range.size);for(const m of this.encrypted){if(o.file_offset>=m.start&&o.file_offset<m.end)throw new A("unavailable_semantics","Encrypted runtime string is unavailable",e);m.start>o.file_offset&&m.start-o.file_offset<BigInt(c)&&(c=Number(m.start-o.file_offset))}const _=Number(o.file_offset),u=[];let d=0,h=0;const C=(m,p)=>{try{return Aa.decode(this.image.bytes.read(o.file_offset+BigInt(m),p-m))}catch{throw new A("malformed_image","Runtime string is not valid UTF-8",e)}};for(;d<c&&d<=this.limits.max_string_bytes;){this.context.checkpoint(1);const m=this.image.bytes.at(_+d);if(m===0){if(this.stringBytes+=d+1,this.stringBytes>this.limits.max_total_string_bytes)throw new A("resource_limit","Runtime string byte budget reached",e);u.push(C(h,d));const p=u.join("");if(!i&&p.length===0)throw new A("malformed_image","Empty runtime metadata name",e);if(p.length>8192)throw new A("resource_limit","Runtime symbolic string output bound reached",e);return p}if(t&&m>=1&&m<=31){const p=m<=23?4:8;if(d+1+p>c||d+1+p>this.limits.max_string_bytes)throw new A("malformed_image","Truncated Swift symbolic-reference payload",e);u.push(C(h,d));let S="";for(let F=1;F<=p;F++)S+=this.image.bytes.at(_+d+F).toString(16).padStart(2,"0");u.push(`\\x${m.toString(16).padStart(2,"0")}{${S}}`),d+=p+1,h=d}else{if(m<32||m===127)throw new A("malformed_image","Control byte in runtime metadata name",e);d++}}throw new A(d>this.limits.max_string_bytes?"resource_limit":"malformed_image","Runtime string is unterminated within its bounded backing",e)}executable(e){if(e%4n!==0n)return!1;try{const t=this.section(e,4n);return!t.permissions.includes("execute")||(t.flags&0x80000400n)===0n&&(t.flags&0xffn)!==8n?!1:(this.file(e,4n),!this.image.hints.some(i=>{if(i.kind!=="data")return!1;const a=this.image.address_map.translate(i.range.start,"va").address.value;return e<a+i.range.size&&a<e+4n}))}catch(t){if(!(t instanceof A))throw t;return!1}}count(e,t){if(e>BigInt(this.limits.max_entries))throw new A("resource_limit","Runtime metadata list entry bound reached",t);return Number(e)}depth(e,t){if(e>this.limits.max_depth)throw new A("resource_limit","Runtime metadata traversal depth reached",t)}attempt(e){try{e()}catch(t){if(!(t instanceof A)||t.code==="resource_limit")throw t;this.report(t)}}report(e){this.partial=!0,this.diagnostics.length<256&&this.diagnostics.push({code:e.code,severity:"warning",message:e.message,address:this.address(e.address),evidence_ids:[]})}add(e,t,i,a,r={}){if(this.context.checkpoint(1),t.length>4096||(r.owner?.length??0)>4096)throw new A("resource_limit","Qualified runtime name bound reached",i);const n=Mt(this.image.selected_slice_id,"runtime-record",[e,i,r.owner??null,t]);if(this.seen.has(n))return;if(this.records.length>=this.limits.max_records)throw new A("resource_limit","Runtime metadata record bound reached",i);const o=this.section(i,a),c=`evidence_${xt([n,"record-bytes"])}`,_=`evidence_${xt([n,this.revision,"runtime-parser-v1"])}`;this.file(i,a);let u=r.target===void 0||r.target===null?null:this.address(r.target),d=r.target_role??(u?"metadata":"unresolved");d==="code"&&(u===null||!this.executable(u.value))&&(this.report(new A("unavailable_semantics","Runtime method implementation is not established readable ARM64 code",u?.value??i)),u=null,d="unresolved");const h=new Set([c]);for(let p=0n;p<a;p+=8n){this.context.checkpoint(1);for(const S of this.fixups.get(i+p)?.evidence_ids??[])h.add(S)}if(h.size>1e3)throw new A("resource_limit","Runtime record evidence bound reached",i);if(this.seen.add(n),this.records.push({id:n,kind:e,name:t,address:this.address(i),byte_length:a,owner:r.owner??null,target:u,target_role:d,method_kind:r.method_kind??null,type_name:r.type??null,type_encoding:r.encoding??null,flags:r.flags??null,...r.ivar?{ivar:r.ivar}:{},evidence_ids:[_]}),this.evidence.push({id:c,origin:{kind:"binary",range:{start:this.address(i),size:a},description:"Static runtime metadata record bytes"},claim:"Bounded runtime metadata record in the selected image",derived_from:[...o.evidence_ids],conflicts_with:[],revision:this.revision},{id:_,origin:{kind:"analysis",analyzer:"macho-runtime-metadata",version:"1",rule:e},claim:"Static metadata name/reference; no instance layout or source signature inferred",derived_from:[...h],conflicts_with:[],revision:this.revision}),r.symbol===!1)return;const C=d==="code"&&u!==null,m=C&&r.symbol!==void 0?r.symbol:void 0;this.symbols.push({id:Mt(this.image.selected_slice_id,"runtime-symbol",n),original_name:m??t,display_name:m??(r.owner?`${r.owner}.${t}`:t),kind:C?"function":"object",address:C?u:this.address(i),size:C?null:a,binding:"local",evidence_ids:[_]})}}class me{r;static sections=new Set(["__objc_classlist","__objc_nlclslist","__objc_catlist","__objc_nlcatlist","__objc_protolist","__objc_selrefs","__objc_classrefs","__objc_superrefs"]);static auxiliary=new Set(["__objc_stubs","__cfstring"]);classes=new Map;activeClasses=new Set;protocols=new Map;activeProtocols=new Set;constructor(e){this.r=e}name(e,t=!1){const i=this.r.pointer(e);if(i===null)throw new A("malformed_image","Missing Objective-C metadata name pointer",e);return this.r.text(i,!1,t)}classAt(e,t){this.r.file(e,8n);const i=this.r.externalClasses.get(e),a=this.r.fixups.get(e);if(i!==void 0){if(i===null||a?.conflicting||a?.external===!1)throw new A("unavailable_semantics","Conflicting Objective-C class reference identities",e);return{name:i,target:null}}const r=this.r.pointer(e);return r===null?null:{name:this.classInfo(r,t),target:r}}methods(e,t,i,a=!1){if(e===null)return;const r=this.r,n=r.u32(e),o=r.count(BigInt(r.u32(e+4n)),e),c=(n&2147483648)!==0,_=(n&1073741824)!==0,u=n&65532;if(u<(c?12:24))throw new A("malformed_image","Invalid Objective-C method record stride",e);o&&r.file(e+8n,BigInt(o*u));for(let d=0;d<o;d++)r.attempt(()=>{const h=e+8n+BigInt(d*u);let C,m,p;if(c?(C=r.relative(h),!_&&C!==null&&(C=r.pointer(C)),m=r.relative(h+4n),p=a?null:r.relative(h+8n)):(C=r.pointer(h),m=r.pointer(h+8n),p=a?null:r.pointer(h+16n)),C===null)throw new A("malformed_image","Missing Objective-C method selector",h);const S=r.text(C);r.add(a?"objc_method_declaration":"objc_method",S,h,BigInt(u),{owner:t,target:p,target_role:a?"unresolved":"code",method_kind:i?"class":"instance",type:m===null?null:r.text(m,!1,!0),encoding:"objc",flags:BigInt(n),symbol:`${i?"+":"-"}[${t} ${S}]`})})}ivars(e,t){if(e===null)return;const i=this.r,a=i.u32(e),r=i.count(BigInt(i.u32(e+4n)),e);if(a<32)throw new A("malformed_image","Invalid Objective-C ivar stride",e);r&&i.file(e+8n,BigInt(r*a));for(let n=0;n<r;n++)i.attempt(()=>{const o=e+8n+BigInt(n*a),c=this.name(o+8n),_=this.name(o+16n,!0),u=i.pointer(o),d=u===null?null:i.u32(u)|0,h=i.u32(o+28n);i.add("objc_ivar",c,o,BigInt(a),{owner:t,type:_||null,encoding:"objc",...d!==null&&d>=0?{ivar:{offset:BigInt(d),size:BigInt(h)}}:{}})})}adopted(e,t,i){if(e===null)return;const a=this.r,r=a.count(a.u64(e),e);r&&a.file(e+8n,BigInt(r*8));for(let n=0;n<r;n++)a.attempt(()=>{const o=e+8n+BigInt(n*8),c=a.pointer(o);if(c===null)return;const _=this.protocol(c,i+1);a.add("objc_protocol_adoption",_,o,8n,{owner:t,target:c})})}protocol(e,t){const i=this.r;if(i.depth(t,e),this.activeProtocols.has(e))throw new A("malformed_image","Cyclic Objective-C protocol adoption",e);const a=this.protocols.get(e);if(a!==void 0)return a;i.file(e,72n);const r=i.u32(e+64n);if(r<72)throw new A("malformed_image","Truncated Objective-C protocol descriptor",e);i.file(e,BigInt(r));const n=this.name(e+8n);this.activeProtocols.add(e);try{i.add("objc_protocol",n,e,72n),i.attempt(()=>this.adopted(i.pointer(e+16n),n,t));for(const[o,c]of[[24n,!1],[32n,!0],[40n,!1],[48n,!0]])i.attempt(()=>this.methods(i.pointer(e+o),n,c,!0));return this.protocols.set(e,n),n}finally{this.activeProtocols.delete(e)}}classInfo(e,t=0,i=!1,a){const r=this.r;if(r.depth(t,e),this.activeClasses.has(e))throw new A("malformed_image","Cyclic Objective-C class metadata",e);const n=this.classes.get(e);if(n){if(n.metaclass!==i)throw new A("malformed_image","Objective-C class/metaclass relationship mismatch",e);return n.name}r.file(e,40n);const o=r.pointer(e+32n);if(o===null)throw new A("malformed_image","Missing Objective-C class data",e);if(o&0x8000000000000000n)throw new A("unavailable_semantics","Realized class_rw data is not static class_ro metadata",e);const c=o&0x00007ffffffffff8n;r.file(c,72n);const _=r.u32(c);if(_&3758096384)throw new A("unavailable_semantics","Dynamic Objective-C class flags are unsupported",c);if((_&1)!==0!==i)throw new A("malformed_image","Objective-C class_ro metaclass flag mismatch",c);const u=this.name(c+24n);this.activeClasses.add(e);try{return r.add(i?"objc_metaclass":"objc_class",u,e,40n,{...a===void 0?{}:{owner:a},flags:BigInt(_)}),this.classes.set(e,{name:u,metaclass:i}),i||r.attempt(()=>{const d=this.classAt(e+8n,t+1);d&&r.add("objc_superclass_reference",d.name,e+8n,8n,{owner:u,target:d.target})}),r.attempt(()=>this.methods(r.pointer(c+32n),a??u,i)),r.attempt(()=>this.adopted(r.pointer(c+40n),a??u,t)),i||r.attempt(()=>this.ivars(r.pointer(c+48n),u)),i||r.attempt(()=>{const d=r.pointer(e);d!==null&&(this.classInfo(d,t+1,!0,u),r.add("objc_metaclass_link",u,e,8n,{owner:u,target:d}))}),u}finally{this.activeClasses.delete(e)}}category(e){const t=this.r;t.file(e,48n);const i=this.name(e),a=this.classAt(e+8n,0);if(a===null)throw new A("malformed_image","Missing Objective-C category class",e);const r=`${a.name}(${i})`;t.add("objc_category",i,e,48n,{owner:a.name,target:a.target}),t.attempt(()=>this.methods(t.pointer(e+16n),r,!1)),t.attempt(()=>this.methods(t.pointer(e+24n),r,!0)),t.attempt(()=>this.adopted(t.pointer(e+32n),r,0))}run(){const e=this.r;for(const t of e.sections)me.sections.has(t.name)?e.attempt(()=>{const i=t.virtual_range.start.value,a=t.virtual_range.size;if(a%8n)throw new A("malformed_image","Misaligned Objective-C pointer array",i);const r=e.count(a/8n,i);e.file(i,a);for(let n=0;n<r;n++)e.attempt(()=>{const o=i+BigInt(n*8);if(t.name==="__objc_classrefs"||t.name==="__objc_superrefs"){const _=this.classAt(o,0);_&&e.add(t.name==="__objc_superrefs"?"objc_superclass_reference":"objc_class_reference",_.name,o,8n,{target:_.target});return}const c=e.pointer(o);c!==null&&(t.name==="__objc_classlist"||t.name==="__objc_nlclslist"?this.classInfo(c):t.name==="__objc_catlist"||t.name==="__objc_nlcatlist"?this.category(c):t.name==="__objc_protolist"?this.protocol(c,0):e.add("objc_selector",e.text(c),o,8n,{target:c}))})}):t.name==="__objc_stubs"?e.attempt(()=>this.selectorStubs(t)):t.name==="__cfstring"&&e.attempt(()=>this.constantStrings(t))}selectorStubs(e){const t=this.r;if(t.image.target.architecture!=="arm64")return;const i=e.virtual_range.start.value,a=i+e.virtual_range.size;t.file(i,e.virtual_range.size);const r=(_,u,d)=>{if((u&2667577375)!==(2415919104|d))return null;const h=(u>>>5&524287)*4+(u>>>29&3),C=h>=1048576?h-2097152:h;return(_&~0xfffn)+BigInt(C)*0x1000n},n=(_,u)=>(_&4290774015)===(4181721088|u<<5|u)?BigInt((_>>>10&4095)*8):null,o=(_,u)=>_+BigInt(u*4)>a?null:Array.from({length:u},(d,h)=>t.u32(_+BigInt(h*4)));let c=i;for(;c<a;){if(t.context.checkpoint(1),(t.u32(c)&4292870175)>>>0===3558866944){c+=4n;continue}const _=o(c,3),u=_&&r(c,_[0],1),d=_&&n(_[1],1);if(!_||u===null||d===null)throw new A("unavailable_semantics","Unrecognized Objective-C stub",c);let h,C;if((_[2]&4227858432)===335544320){const p=_[2]&67108863,S=c+8n+BigInt((p>=33554432?p-67108864:p)*4);h=12n,C=t.importEntries.get(S)==="_objc_msgSend"}else{const p=o(c+8n,3),S=p&&r(c+8n,p[0],16),F=p&&n(p[1],16);if(!p||S===null||F===null||p[2]!==3592356352)throw new A("unavailable_semantics","Unrecognized Objective-C stub",c);h=20n,C=t.importSlots.get(S+F)==="_objc_msgSend"}const m=c;if(c+=h,!C)throw new A("unavailable_semantics","Objective-C stub does not reach the bound _objc_msgSend import",m);t.attempt(()=>{const p=u+d;if(t.section(p,8n).name!=="__objc_selrefs")throw new A("malformed_image","Objective-C stub selector is outside __objc_selrefs",m);const S=t.pointer(p);if(S===null)throw new A("malformed_image","Objective-C stub selector is null",m);const F=t.text(S);t.add("objc_selector_stub",F,m,h,{target:m,target_role:"code",symbol:`_objc_msgSend$${F}`})})}}constantStrings(e){const t=this.r,i=e.virtual_range.start.value,a=e.virtual_range.size;if(a%32n)throw new A("malformed_image","Misaligned constant string section",i);const r=t.count(a/32n,i);t.file(i,a);for(let n=0;n<r;n++)t.attempt(()=>{const o=i+BigInt(n*32);if(t.importSlots.get(o)!=="___CFConstantStringClassReference")throw new A("unavailable_semantics","Constant string class reference is not established",o);const c=t.u32(o+8n),_=t.pointer(o+16n),u=t.u64(o+24n),d=c===2e3;if(c!==1992&&!d||_===null)throw new A("unavailable_semantics","Unsupported constant string",o);if(u>BigInt(t.limits.max_string_bytes))return;const h=u*(d?2n:1n);let C="";if(h){const m=t.image.bytes.read(t.file(_,h),Number(h));if(t.stringBytes+=m.length,t.stringBytes>t.limits.max_total_string_bytes)throw new A("resource_limit","Runtime string byte budget reached",o);if(!d&&m.some(p=>p>=128))throw new A("malformed_image","Non-ASCII 8-bit constant string",o);try{C=new TextDecoder(d?"utf-16le":"ascii",{fatal:!0}).decode(m)}catch{throw new A("malformed_image","Constant string is not valid UTF-16",o)}}t.add("objc_string",C,o,32n,{target:_,symbol:!1})})}}class Bt{r;static sections=new Set(["__swift5_types","__swift5_fieldmd"]);contexts=new Map;active=new Set;owners=new Map;attemptedFields=new Set;fieldRanges=[];constructor(e){this.r=e}context(e,t=0){const i=this.r;if(i.depth(t,e),this.active.has(e))throw new A("malformed_image","Cyclic Swift context descriptor",e);const a=this.contexts.get(e);if(a)return a;const r=i.u32(e),n=r&31;if((r>>>8&255)!==0)throw new A("unavailable_semantics","Unsupported Swift context descriptor version",e);if(![0,1,3,16,17,18].includes(n))throw new A("unavailable_semantics","Unsupported Swift context descriptor kind",e);const o=n<=1?12n:n===3?24n:n===16?44n:28n;i.file(e,o),this.active.add(e);try{const c=i.relative(e+4n,!0),_=c===null?null:this.context(c,t+1).name,u=i.relative(e+8n);if(u===null)throw new A("malformed_image","Missing Swift context name",e);const d=i.text(u,n===1),h=_===null?d:`${_}.${d}`;if(h.length>4096)throw new A("resource_limit","Qualified Swift context name bound reached",e);const C=n<16?null:i.relative(e+16n),m={name:h,kind:n,fields:C},p=n===0?"swift_module":n===1?"swift_extension":n===3?"swift_protocol":n===16?"swift_class":n===17?"swift_structure":"swift_enum";if(i.add(p,d,e,o,{..._===null?{}:{owner:_},encoding:n===1?"swift-mangled":null,flags:BigInt(r)}),this.contexts.set(e,m),C!==null){let S=this.owners.get(C);S||(S=new Set,this.owners.set(C,S)),S.size&&!S.has(h)&&i.report(new A("unavailable_semantics","Different Swift contexts reference the same field descriptor; all owners are retained",C)),S.add(h)}return c!==null&&i.add("swift_parent",_,e+4n,4n,{owner:h,target:c}),n===16&&i.attempt(()=>{const S=i.relative(e+20n);S!==null&&i.add("swift_superclass",i.text(S,!0),e+20n,4n,{owner:h,target:S,encoding:"swift-mangled"})}),m}finally{this.active.delete(e)}}fields(e,t,i=!1){const a=this.r;this.attemptedFields.add(e),a.file(e,16n);const r=a.u16(e+8n),n=a.u16(e+10n),o=a.count(BigInt(a.u32(e+12n)),e);if(r>7||n<12)throw new A("unavailable_semantics","Unsupported Swift field descriptor kind or stride",e);const c=e+16n+BigInt(o*n);if(c>t)throw new A("malformed_image","Swift field descriptor crosses its declared section",e);if(i){for(const p of this.fieldRanges)if(a.context.checkpoint(1),e<p.end&&p.start<c)throw new A("malformed_image","Swift field reference overlaps another descriptor",e)}o&&a.file(e+16n,BigInt(o*n));const _=a.relative(e),u=_===null?null:a.text(_,!0),d=[...this.owners.get(e)??[]];if(d.length===0&&d.push(u??""),o*d.length>a.limits.max_records-a.records.length)throw new A("resource_limit","Swift field records exceed the remaining metadata record bound",e);const h=[];for(let p=0;p<o;p++){a.context.checkpoint(1);const S=e+16n+BigInt(p*n),F=a.u32(S),y=a.relative(S+8n),k=a.relative(S+4n);if(y===null)throw new A("malformed_image","Missing Swift field name",S);h.push({address:S,name:a.text(y),type:k===null?null:a.text(k,!0),flags:BigInt(F)})}const C=a.relative(e+4n),m=C===null?null:a.text(C,!0);for(const p of d){const S=p?{owner:p}:{};u!==null&&a.add("swift_field_descriptor",u,e,16n,{...S,type:u,encoding:"swift-mangled",flags:BigInt(r)}),m!==null&&a.add("swift_superclass",m,e+4n,4n,{...S,target:C,encoding:"swift-mangled"});for(const F of h)a.add(r===2||r===3?"swift_enum_case":"swift_field",F.name,F.address,12n,{...S,type:F.type,encoding:"swift-mangled",flags:F.flags})}return this.fieldRanges.push({start:e,end:c}),c}run(){const e=this.r;for(const i of e.sections)i.name==="__swift5_types"&&e.attempt(()=>{const a=i.virtual_range.start.value,r=i.virtual_range.size;if(r%4n)throw new A("malformed_image","Misaligned Swift type reference array",a);const n=e.count(r/4n,a);e.file(a,r);for(let o=0;o<n;o++)e.attempt(()=>{const c=a+BigInt(o*4);if((e.u32(c)&3)>1)throw new A("unavailable_semantics","Unsupported Objective-C reference kind in Swift type metadata",c);const _=e.relative(c,!0);if(_!==null){if(![16,17,18].includes(e.u32(_)&31))throw new A("malformed_image","Swift type reference does not identify a nominal type",c);this.context(_)}})});const t=e.sections.filter(i=>i.name==="__swift5_fieldmd");for(const i of t)e.attempt(()=>{const a=i.virtual_range.start.value+i.virtual_range.size;let r=i.virtual_range.start.value;for(;r<a;){if(e.context.checkpoint(1),a-r<16n)throw new A("malformed_image","Truncated Swift field descriptor header",r);r=this.fields(r,a)}});for(const i of this.owners.keys())e.attempt(()=>{if(this.attemptedFields.has(i))return;const a=e.section(i,16n);if(a.name!=="__swift5_fieldmd")throw new A("malformed_image","Swift field reference is outside its declared field section",i);this.fields(i,a.virtual_range.start.value+a.virtual_range.size,!0)})}}function qs(s,e){const{image:t,revision:i}=s;if(!Number.isSafeInteger(i)||i<0)throw new RangeError("Invalid runtime metadata revision");e.checkpoint(0);let a=!1;if(t.target.format==="macho")for(const n of t.sections)e.checkpoint(1),n.kind==="section"&&n.virtual_range.size>0n&&(me.sections.has(n.name)||me.auxiliary.has(n.name)||Bt.sections.has(n.name))&&(a=!0);if(!a)return{state:"absent",records:[],symbols:[],evidence:[],diagnostics:[]};let r=null;try{r=new wa(t,i,e,s.limits??{}),new me(r).run(),new Bt(r).run()}catch(n){if(!(n instanceof A))throw n;if(r===null)return{state:"partial",records:[],symbols:[],evidence:[],diagnostics:[{code:n.code,severity:"warning",message:n.message,address:{image_id:t.id,space:"va",value:n.address},evidence_ids:[]}]};r.report(n)}return{state:r.partial?"partial":"complete",records:r.records,symbols:r.symbols,evidence:r.evidence,diagnostics:r.diagnostics}}const Ta="zig 0.17.1 (clang 22.1.8) Darwin libc headers, arm64-apple-macos13",ya=["dirent.h","fts_compat.h","runetype.h","arm/_types.h","mach/message.h","sys/_types/_fd_def.h","fenv.h","glob.h","iconv.h","malloc/malloc.h","_regex.h","sys/_types/_sigaltstack.h","_stdio.h","sys/signal.h","sys/_pthread/_pthread_types.h","sys/unistd.h","netdb.h","sys/aio.h","sys/attr.h","bsm/audit.h","sys/socket.h","sys/dirent.h","dlfcn.h","mach/dyld_kernel.h","sys/mount.h","sys/fcntl.h","sys/_types/_fsid_t.h","sys/_types/_fsobj_id_t.h","grp.h","mach_debug/hash_info.h","net/if.h","ifaddrs.h","execinfo.h","netinet6/in6.h","netinet/in.h","sys/_types/_iovec_t.h","sys/cdefs.h","sys/ipc.h","sys/time.h","sys/event.h","_locale.h","mach-o/loader.h","mach_debug/lockgroup_info.h","mach_debug/zone_info.h","mach/port.h","mach/mach_time.h","mach/clock_types.h","mach/vm_region.h","","getopt.h","os/lock.h","pwd.h","sys/poll.h","sys/proc_info.h","sys/resource.h","pthread/sched.h","sys/sem.h","sys/un.h","sys/stat.h","sys/statvfs.h","sys/termios.h","sys/_types/_timespec.h","sys/_types/_timeval.h","_time.h","sys/times.h","utime.h","sys/utsname.h","mach_debug/vm_info.h","mach/vm_statistics.h","sys/ttycom.h","wordexp.h"],Na=`=Dl_info|struct dl_info
=FILE|struct __sFILE
=FTSENT|struct _ftsent
=__darwin_pthread_attr_t|struct _opaque_pthread_attr_t
=__darwin_pthread_cond_t|struct _opaque_pthread_cond_t
=__darwin_pthread_condattr_t|struct _opaque_pthread_condattr_t
=__darwin_pthread_mutex_t|struct _opaque_pthread_mutex_t
=__darwin_pthread_mutexattr_t|struct _opaque_pthread_mutexattr_t
=__darwin_pthread_once_t|struct _opaque_pthread_once_t
=__darwin_pthread_rwlock_t|struct _opaque_pthread_rwlock_t
=__darwin_pthread_rwlockattr_t|struct _opaque_pthread_rwlockattr_t
=dyld_kernel_image_info_t|struct dyld_kernel_image_info
=dyld_kernel_process_info_t|struct dyld_kernel_process_info
=fhandle_t|struct fhandle
=hash_info_bucket_t|struct hash_info_bucket
=ipc_info_name_t|struct ipc_info_name
=ipc_info_port_t|struct ipc_info_port
=ipc_info_space_basic_t|struct ipc_info_space_basic
=ipc_info_space_t|struct ipc_info_space
=ipc_info_tree_name_t|struct ipc_info_tree_name
=lockgroup_info_t|struct lockgroup_info
=mach_memory_info_t|struct mach_memory_info
=mach_port_options_t|struct mach_port_options
=mach_port_qos_t|struct mach_port_qos
=mach_service_port_info_data_t|struct mach_service_port_info
=mach_timespec_t|struct mach_timespec
=mach_zone_info_t|struct mach_zone_info_data
=mach_zone_name_t|struct mach_zone_name
=malloc_zone_t|struct _malloc_zone_t
=os_unfair_lock|struct os_unfair_lock_s
=pthread_attr_t|struct _opaque_pthread_attr_t
=pthread_cond_t|struct _opaque_pthread_cond_t
=pthread_condattr_t|struct _opaque_pthread_condattr_t
=pthread_mutex_t|struct _opaque_pthread_mutex_t
=pthread_mutexattr_t|struct _opaque_pthread_mutexattr_t
=pthread_once_t|struct _opaque_pthread_once_t
=pthread_rwlock_t|struct _opaque_pthread_rwlock_t
=sa_endpoints_t|struct sa_endpoints
=siginfo_t|struct __siginfo
=stack_t|struct __darwin_sigaltstack
=task_purgable_info_t|struct vm_purgeable_info
=task_zone_info_t|struct task_zone_info_data
=vm_info_object_t|struct vm_info_object
=vm_info_region_64_t|struct vm_info_region_64
=vm_info_region_t|struct vm_info_region
=vm_purgeable_stat_t|struct vm_purgeable_stat
DIR|136|8|s|0|__dd_fd:0:i,__dd_loc:8:z,__dd_size:16:z,__dd_buf:24:*c,__dd_len:32:i,__dd_seek:40:l,__padding:48:l,__dd_flags:56:i,__dd_lock:64:@struct _opaque_pthread_mutex_t;,__dd_td:128:*@struct _telldir;
FTS|72|8|s|1|fts_cur:0:*@struct _ftsent;,fts_child:8:*@struct _ftsent;,fts_array:16:**@struct _ftsent;,fts_dev:24:i,fts_path:32:*c,fts_rfd:40:i,fts_pathlen:44:i,fts_nitems:48:i,fts_compar:56:p,fts_compar_b:56:p,fts_options:64:i
_RuneCharClass|20|4|s|2|__name:0:[14]c,__mask:16:u
_RuneEntry|24|8|s|2|__min:0:i,__max:4:i,__map:8:i,__types:16:*u
_RuneLocale|3208|8|s|2|__magic:0:[8]c,__encoding:8:[32]c,__sgetrune:40:p,__sputrune:48:p,__invalid_rune:56:i,__runetype:60:[256]u,__maplower:1084:[256]i,__mapupper:2108:[256]i,__runetype_ext:3136:@_RuneRange;,__maplower_ext:3152:@_RuneRange;,__mapupper_ext:3168:@_RuneRange;,__variable:3184:*v,__variable_len:3192:i,__ncharclasses:3196:i,__charclasses:3200:*@_RuneCharClass;
_RuneRange|16|8|s|2|__nranges:0:i,__ranges:8:*@_RuneEntry;
__mbstate_t|128|8|u|3|__mbstate8:0:[128]c,_mbstateL:0:q
audit_token_t|32|4|s|4|val:0:[8]u
fd_set|128|4|s|5|fds_bits:0:[32]i
fenv_t|16|8|s|6|__fpsr:0:r,__fpcr:8:r
glob_t|88|8|s|7|gl_pathc:0:z,gl_matchc:8:i,gl_offs:16:z,gl_flags:24:i,gl_pathv:32:**c,gl_errfunc:40:p,gl_errblk:40:p,gl_closedir:48:p,gl_readdir:56:p,gl_opendir:64:p,gl_lstat:72:p,gl_stat:80:p
iconv_allocation_t|512|8|s|8|spaceholder:0:[64]*v
mach_msg_header_t|24|4|s|4|msgh_bits:0:u,msgh_size:4:u,msgh_remote_port:8:u,msgh_local_port:12:u,msgh_voucher_port:16:u,msgh_id:20:i
malloc_statistics_t|32|8|s|9|blocks_in_use:0:u,size_in_use:8:z,max_size_in_use:16:z,size_allocated:24:z
regex_t|32|8|s|a|re_magic:0:i,re_nsub:8:z,re_endp:16:^c,re_g:24:*@struct re_guts;
regmatch_t|16|8|s|a|rm_so:0:j,rm_eo:8:j
struct __darwin_sigaltstack|24|8|s|b|ss_sp:0:*v,ss_size:8:z,ss_flags:16:i
struct __sFILE|152|8|s|c|_p:0:*h,_r:8:i,_w:12:i,_flags:16:s,_file:18:s,_bf:24:@struct __sbuf;,_lbfsize:40:i,_cookie:48:*v,_ub:88:@struct __sbuf;,_extra:104:*@struct __sFILEX;,_ur:112:i,_ubuf:116:[3]h,_nbuf:119:[1]h,_lb:120:@struct __sbuf;,_blksize:136:i,_offset:144:j
struct __sbuf|16|8|s|c|_base:0:*h,_size:8:i
struct __siginfo|104|8|s|d|si_signo:0:i,si_errno:4:i,si_code:8:i,si_pid:12:i,si_uid:16:u,si_status:20:i,si_addr:24:*v,si_value:32:@union sigval;,si_band:40:l,__pad:48:[7]m
struct _ftsent|112|8|s|1|fts_cycle:0:*@struct _ftsent;,fts_parent:8:*@struct _ftsent;,fts_link:16:*@struct _ftsent;,fts_number:24:l,fts_pointer:32:*v,fts_accpath:40:*c,fts_path:48:*c,fts_errno:56:i,fts_symfd:60:i,fts_pathlen:64:t,fts_namelen:66:t,fts_ino:72:k,fts_dev:80:i,fts_nlink:84:t,fts_level:86:s,fts_info:88:t,fts_flags:90:t,fts_instr:92:t,fts_statp:96:*@struct stat;,fts_name:104:[1]c
struct _malloc_zone_t|200|8|s|9|reserved1:0:*v,reserved2:8:*v,size:16:p,malloc:24:p,calloc:32:p,valloc:40:p,free:48:p,realloc:56:p,destroy:64:p,zone_name:72:^c,batch_malloc:80:p,batch_free:88:p,introspect:96:*@struct malloc_introspection_t;,version:104:u,memalign:112:p,free_definite_size:120:p,pressure_relief:128:p,claimed_address:136:p,try_free_default:144:p,malloc_with_options:152:p,malloc_type_malloc:160:p,malloc_type_calloc:168:p,malloc_type_realloc:176:p,malloc_type_memalign:184:p,malloc_type_malloc_with_options:192:p
struct _opaque_pthread_attr_t|64|8|s|e|__sig:0:l,__opaque:8:[56]c
struct _opaque_pthread_cond_t|48|8|s|e|__sig:0:l,__opaque:8:[40]c
struct _opaque_pthread_condattr_t|16|8|s|e|__sig:0:l,__opaque:8:[8]c
struct _opaque_pthread_mutex_t|64|8|s|e|__sig:0:l,__opaque:8:[56]c
struct _opaque_pthread_mutexattr_t|16|8|s|e|__sig:0:l,__opaque:8:[8]c
struct _opaque_pthread_once_t|16|8|s|e|__sig:0:l,__opaque:8:[8]c
struct _opaque_pthread_rwlock_t|200|8|s|e|__sig:0:l,__opaque:8:[192]c
struct _opaque_pthread_rwlockattr_t|24|8|s|e|__sig:0:l,__opaque:8:[16]c
struct accessx_descriptor|16|4|s|f|ad_name_offset:0:u,ad_flags:4:i,ad_pad:8:[2]i
struct addrinfo|48|8|s|g|ai_flags:0:i,ai_family:4:i,ai_socktype:8:i,ai_protocol:12:i,ai_addrlen:16:u,ai_canonname:24:*c,ai_addr:32:*@struct sockaddr;,ai_next:40:*@struct addrinfo;
struct aiocb|80|8|s|h|aio_fildes:0:i,aio_offset:8:j,aio_buf:16:*v,aio_iov:16:*@struct iovec;,aio_nbytes:24:z,aio_iovcnt:24:z,aio_reqprio:32:i,aio_sigevent:40:@struct sigevent;,aio_lio_opcode:72:i
struct attrlist|24|4|s|i|bitmapcount:0:t,reserved:2:t,commonattr:4:u,volattr:8:u,dirattr:12:u,fileattr:16:u,forkattr:20:u
struct au_mask|8|4|s|j|am_success:0:u,am_failure:4:u
struct au_tid|8|4|s|j|port:0:i,machine:4:u
struct au_tid_addr|24|4|s|j|at_port:0:i,at_type:4:u,at_addr:8:[4]u
struct auditinfo|24|4|s|j|ai_auid:0:u,ai_mask:4:@struct au_mask;,ai_termid:12:@struct au_tid;,ai_asid:20:i
struct auditinfo_addr|48|8|s|j|ai_auid:0:u,ai_mask:4:@struct au_mask;,ai_termid:12:@struct au_tid_addr;,ai_asid:36:i,ai_flags:40:r
struct cmsghdr|12|4|s|k|cmsg_len:0:u,cmsg_level:4:i,cmsg_type:8:i
struct dirent|1048|8|s|l|d_ino:0:k,d_seekoff:8:k,d_reclen:16:t,d_namlen:18:t,d_type:20:h,d_name:21:[1024]c
struct dl_info|32|8|s|m|dli_fname:0:^c,dli_fbase:8:*v,dli_sname:16:^c,dli_saddr:24:*v
struct dyld_kernel_image_info|40|8|s|n|uuid:0:[16]h,fsobjid:16:@struct fsobj_id;,fsid:24:@struct fsid;,load_addr:32:k
struct dyld_kernel_process_info|72|8|s|n|cache_image_info:0:@struct dyld_kernel_image_info;,timestamp:40:k,imageCount:48:u,initialImageCount:52:u,dyldState:56:h,no_cache:60:i,private_cache:64:i
struct fd_set|128|4|s|5|fds_bits:0:[32]i
struct fhandle|132|4|s|o|fh_len:0:u,fh_data:4:[128]h
struct flock|24|8|s|p|l_start:0:j,l_len:8:j,l_pid:16:i,l_type:20:s,l_whence:22:s
struct fsid|8|4|s|q|val:0:[2]i
struct fsobj_id|8|4|s|r|fid_objno:0:u,fid_generation:4:u
struct fssearchblock|104|8|s|i|returnattrs:0:*@struct attrlist;,returnbuffer:8:*v,returnbuffersize:16:z,maxmatches:24:m,timelimit:32:@struct timeval;,searchparams1:48:*v,sizeofsearchparams1:56:z,searchparams2:64:*v,sizeofsearchparams2:72:z,searchattrs:80:@struct attrlist;
struct group|32|8|s|s|gr_name:0:*c,gr_passwd:8:*c,gr_gid:16:u,gr_mem:24:**c
struct hash_info_bucket|4|4|s|t|hib_count:0:u
struct hostent|32|8|s|g|h_name:0:*c,h_aliases:8:**c,h_addrtype:16:i,h_length:20:i,h_addr_list:24:**c
struct if_nameindex|16|8|s|u|if_index:0:u,if_name:8:*c
struct ifaddrs|56|8|s|v|ifa_next:0:*@struct ifaddrs;,ifa_name:8:*c,ifa_flags:16:u,ifa_addr:24:*@struct sockaddr;,ifa_netmask:32:*@struct sockaddr;,ifa_dstaddr:40:*@struct sockaddr;,ifa_data:48:*v
struct ifmaddrs|32|8|s|v|ifma_next:0:*@struct ifmaddrs;,ifma_name:8:*@struct sockaddr;,ifma_addr:16:*@struct sockaddr;,ifma_lladdr:24:*@struct sockaddr;
struct image_offset|20|4|s|w|uuid:0:[16]h,offset:16:u
struct in6_addr|16|4|s|x|__u6_addr:0:@struct in6_addr.__u6_addr;
struct in6_addr.__u6_addr|0|0|u|x|__u6_addr8:0:[16]h,__u6_addr16:0:[8]t,__u6_addr32:0:[4]u
struct in_addr|4|4|s|y|s_addr:0:u
struct iovec|16|8|s|z|iov_base:0:*v,iov_len:8:z
struct ip_mreq|8|4|s|y|imr_multiaddr:0:@struct in_addr;,imr_interface:4:@struct in_addr;
struct ipc_info_name|28|4|s|10|iin_name:0:u,iin_collision:4:i,iin_type:8:u,iin_urefs:12:u,iin_object:16:u,iin_next:20:u,iin_hash:24:u
struct ipc_info_port|8|4|s|10|iip_port_object:0:u,iip_receiver_object:4:u
struct ipc_info_space|24|4|s|10|iis_genno_mask:0:u,iis_table_size:4:u,iis_table_next:8:u,iis_tree_size:12:u,iis_tree_small:16:u,iis_tree_hash:20:u
struct ipc_info_space_basic|24|4|s|10|iisb_genno_mask:0:u,iisb_table_size:4:u,iisb_table_next:8:u,iisb_table_inuse:12:u,iisb_reserved:16:[2]u
struct ipc_info_tree_name|36|4|s|10|iitn_name:0:@struct ipc_info_name;,iitn_lchild:28:u,iitn_rchild:32:u
struct ipc_perm|24|4|s|11|uid:0:u,gid:4:u,cuid:8:u,cgid:12:u,mode:16:t,_seq:18:t,_key:20:i
struct itimerval|32|8|s|12|it_interval:0:@struct timeval;,it_value:16:@struct timeval;
struct kevent|32|4|s|13|ident:0:z,filter:8:s,flags:10:t,fflags:12:u,data:16:y,udata:24:*v
struct kevent64_s|48|8|s|13|ident:0:k,filter:8:s,flags:10:t,fflags:12:u,data:16:j,udata:24:k,ext:32:[2]k
struct lconv|96|8|s|14|decimal_point:0:*c,thousands_sep:8:*c,grouping:16:*c,int_curr_symbol:24:*c,currency_symbol:32:*c,mon_decimal_point:40:*c,mon_thousands_sep:48:*c,mon_grouping:56:*c,positive_sign:64:*c,negative_sign:72:*c,int_frac_digits:80:c,frac_digits:81:c,p_cs_precedes:82:c,p_sep_by_space:83:c,n_cs_precedes:84:c,n_sep_by_space:85:c,p_sign_posn:86:c,n_sign_posn:87:c,int_p_cs_precedes:88:c,int_n_cs_precedes:89:c,int_p_sep_by_space:90:c,int_n_sep_by_space:91:c,int_p_sign_posn:92:c,int_n_sign_posn:93:c
struct linger|8|4|s|k|l_onoff:0:i,l_linger:4:i
struct load_command|8|4|s|15|cmd:0:u,cmdsize:4:u
struct lockgroup_info|264|8|s|16|lockgroup_name:0:[64]c,lockgroup_attr:64:k,lock_spin_cnt:72:k,lock_spin_util_cnt:80:k,lock_spin_held_cnt:88:k,lock_spin_miss_cnt:96:k,lock_spin_held_max:104:k,lock_spin_held_cum:112:k,lock_mtx_cnt:120:k,lock_mtx_util_cnt:128:k,lock_mtx_held_cnt:136:k,lock_mtx_miss_cnt:144:k,lock_mtx_wait_cnt:152:k,lock_mtx_held_max:160:k,lock_mtx_held_cum:168:k,lock_mtx_wait_max:176:k,lock_mtx_wait_cum:184:k,lock_rw_cnt:192:k,lock_rw_util_cnt:200:k,lock_rw_held_cnt:208:k,lock_rw_miss_cnt:216:k,lock_rw_wait_cnt:224:k,lock_rw_held_max:232:k,lock_rw_held_cum:240:k,lock_rw_wait_max:248:k,lock_rw_wait_cum:256:k
struct mach_header|28|4|s|15|magic:0:u,cputype:4:i,cpusubtype:8:i,filetype:12:u,ncmds:16:u,sizeofcmds:20:u,flags:24:u
struct mach_header_64|32|4|s|15|magic:0:u,cputype:4:i,cpusubtype:8:i,filetype:12:u,ncmds:16:u,sizeofcmds:20:u,flags:24:u,reserved:28:u
struct mach_memory_info|176|8|s|17|flags:0:k,site:8:k,size:16:k,free:24:k,largest:32:k,collectable_bytes:40:k,mapped:48:k,peak:56:k,tag:64:t,zone:66:t,_resvA:68:[2]t,_resv:72:[3]k,name:96:[80]c
struct mach_port_limits|4|4|s|18|mpl_qlimit:0:u
struct mach_port_options|24|8|s|10|flags:0:u,mpl:4:@struct mach_port_limits;,reserved:8:[2]k,work_interval_port:8:u,service_port_info:8:*@struct mach_service_port_info;,service_port_name:8:u
struct mach_port_qos|8|4|s|18|len:4:u
struct mach_service_port_info|256|1|s|18|mspi_string_name:0:[255]c,mspi_domain_type:255:h
struct mach_timebase_info|8|4|s|19|numer:0:u,denom:4:u
struct mach_timespec|8|4|s|1a|tv_sec:0:u,tv_nsec:4:i
struct mach_vm_read_entry|16|4|s|1b|address:0:k,size:8:k
struct mach_zone_info_data|64|8|s|17|mzi_count:0:k,mzi_cur_size:8:k,mzi_max_size:16:k,mzi_elem_size:24:k,mzi_alloc_size:32:k,mzi_sum_size:40:k,mzi_exhaustible:48:k,mzi_collectable:56:k
struct mach_zone_name|80|1|s|17|mzn_name:0:[80]c
struct malloc_introspection_t|136|8|s|9|enumerator:0:p,good_size:8:p,check:16:p,print:24:p,log:32:p,force_lock:40:p,force_unlock:48:p,statistics:56:p,zone_locked:64:p,enable_discharge_checking:72:p,disable_discharge_checking:80:p,discharge:88:p,enumerate_discharged_pointers:96:p,reinit_lock:104:p,print_task:112:p,task_statistics:120:p,zone_type:128:u
struct msghdr|48|8|s|k|msg_name:0:*v,msg_namelen:8:u,msg_iov:16:*@struct iovec;,msg_iovlen:24:i,msg_control:32:*v,msg_controllen:40:u,msg_flags:44:i
struct msqid_ds|116|4|s|1c|msg_perm:0:@struct ipc_perm;,msg_first:24:i,msg_last:28:i,msg_cbytes:32:m,msg_qnum:40:m,msg_qbytes:48:m,msg_lspid:56:i,msg_lrpid:60:i,msg_stime:64:l,msg_pad1:72:i,msg_rtime:76:l,msg_pad2:84:i,msg_ctime:88:l,msg_pad3:96:i,msg_pad4:100:[4]i
struct netent|24|8|s|g|n_name:0:*c,n_aliases:8:**c,n_addrtype:16:i,n_net:20:u
struct option|32|8|s|1d|name:0:^c,has_arg:8:i,flag:16:*i,val:24:i
struct os_unfair_lock_s|4|4|s|1e|_os_unfair_lock_opaque:0:u
struct passwd|72|8|s|1f|pw_name:0:*c,pw_passwd:8:*c,pw_uid:16:u,pw_gid:20:u,pw_change:24:l,pw_class:32:*c,pw_gecos:40:*c,pw_dir:48:*c,pw_shell:56:*c,pw_expire:64:l
struct pollfd|8|4|s|1g|fd:0:i,events:4:s,revents:6:s
struct proc_bsdinfo|136|8|s|1h|pbi_flags:0:u,pbi_status:4:u,pbi_xstatus:8:u,pbi_pid:12:u,pbi_ppid:16:u,pbi_uid:20:u,pbi_gid:24:u,pbi_ruid:28:u,pbi_rgid:32:u,pbi_svuid:36:u,pbi_svgid:40:u,rfu_1:44:u,pbi_comm:48:[16]c,pbi_name:64:[32]c,pbi_nfiles:96:u,pbi_pgid:100:u,pbi_pjobc:104:u,e_tdev:108:u,e_tpgid:112:u,pbi_nice:116:i,pbi_start_tvsec:120:k,pbi_start_tvusec:128:k
struct protoent|24|8|s|g|p_name:0:*c,p_aliases:8:**c,p_proto:16:i
struct rlimit|16|8|s|1i|rlim_cur:0:k,rlim_max:8:k
struct rpcent|24|8|s|g|r_name:0:*c,r_aliases:8:**c,r_number:16:i
struct rusage|144|8|s|1i|ru_utime:0:@struct timeval;,ru_stime:16:@struct timeval;,ru_maxrss:32:l,ru_ixrss:40:l,ru_idrss:48:l,ru_isrss:56:l,ru_minflt:64:l,ru_majflt:72:l,ru_nswap:80:l,ru_inblock:88:l,ru_oublock:96:l,ru_msgsnd:104:l,ru_msgrcv:112:l,ru_nsignals:120:l,ru_nvcsw:128:l,ru_nivcsw:136:l
struct sa_endpoints|40|8|s|k|sae_srcif:0:u,sae_srcaddr:8:^@struct sockaddr;,sae_srcaddrlen:16:u,sae_dstaddr:24:^@struct sockaddr;,sae_dstaddrlen:32:u
struct sched_param|8|4|s|1j|sched_priority:0:i,__opaque:4:[4]c
struct searchstate|556|4|s|i|ss_union_flags:0:u,ss_union_layer:4:u,ss_fsstate:8:[548]h
struct section_64|80|8|s|15|sectname:0:[16]c,segname:16:[16]c,addr:32:k,size:40:k,offset:48:u,align:52:u,reloff:56:u,nreloc:60:u,flags:64:u,reserved1:68:u,reserved2:72:u,reserved3:76:u
struct segment_command_64|72|8|s|15|cmd:0:u,cmdsize:4:u,segname:8:[16]c,vmaddr:24:k,vmsize:32:k,fileoff:40:k,filesize:48:k,maxprot:56:i,initprot:60:i,nsects:64:u,flags:68:u
struct sembuf|6|2|s|1k|sem_num:0:t,sem_op:2:s,sem_flg:4:s
struct servent|32|8|s|g|s_name:0:*c,s_aliases:8:**c,s_port:16:i,s_proto:24:*c
struct sf_hdtr|32|8|s|k|headers:0:*@struct iovec;,hdr_cnt:8:i,trailers:16:*@struct iovec;,trl_cnt:24:i
struct shmid_ds|76|4|s|1c|shm_perm:0:@struct ipc_perm;,shm_segsz:24:z,shm_lpid:32:i,shm_cpid:36:i,shm_nattch:40:t,shm_atime:44:l,shm_dtime:52:l,shm_ctime:60:l,shm_internal:68:*v
struct sigaction|16|8|s|d|__sigaction_u:0:@union __sigaction_u;,sa_mask:8:u,sa_flags:12:i
struct sigevent|32|8|s|d|sigev_notify:0:i,sigev_signo:4:i,sigev_value:8:@union sigval;,sigev_notify_function:16:p,sigev_notify_attributes:24:*@struct _opaque_pthread_attr_t;
struct sigvec|16|8|s|d|sv_handler:0:p,sv_mask:8:i,sv_flags:12:i
struct sockaddr|16|1|s|k|sa_len:0:h,sa_family:1:h,sa_data:2:[14]c
struct sockaddr_in|16|4|s|y|sin_len:0:h,sin_family:1:h,sin_port:2:t,sin_addr:4:@struct in_addr;,sin_zero:8:[8]c
struct sockaddr_in6|28|4|s|x|sin6_len:0:h,sin6_family:1:h,sin6_port:2:t,sin6_flowinfo:4:u,sin6_addr:8:@struct in6_addr;,sin6_scope_id:24:u
struct sockaddr_storage|128|8|s|k|ss_len:0:h,ss_family:1:h,__ss_pad1:2:[6]c,__ss_align:8:j,__ss_pad2:16:[112]c
struct sockaddr_un|106|1|s|1l|sun_len:0:h,sun_family:1:h,sun_path:2:[104]c
struct stat|144|8|s|1m|st_dev:0:i,st_mode:4:t,st_nlink:6:t,st_ino:8:k,st_uid:16:u,st_gid:20:u,st_rdev:24:i,st_atimespec:32:@struct timespec;,st_mtimespec:48:@struct timespec;,st_ctimespec:64:@struct timespec;,st_birthtimespec:80:@struct timespec;,st_size:96:j,st_blocks:104:j,st_blksize:112:i,st_flags:116:u,st_gen:120:u,st_lspare:124:i,st_qspare:128:[2]j
struct statfs|2168|8|s|o|f_bsize:0:u,f_iosize:4:i,f_blocks:8:k,f_bfree:16:k,f_bavail:24:k,f_files:32:k,f_ffree:40:k,f_fsid:48:@struct fsid;,f_owner:56:u,f_type:60:u,f_flags:64:u,f_fssubtype:68:u,f_fstypename:72:[16]c,f_mntonname:88:[1024]c,f_mntfromname:1112:[1024]c,f_flags_ext:2136:u,f_reserved:2140:[7]u
struct statvfs|64|8|s|1n|f_bsize:0:m,f_frsize:8:m,f_blocks:16:u,f_bfree:20:u,f_bavail:24:u,f_files:28:u,f_ffree:32:u,f_favail:36:u,f_fsid:40:m,f_flag:48:m,f_namemax:56:m
struct task_zone_info_data|88|8|s|17|tzi_count:0:k,tzi_cur_size:8:k,tzi_max_size:16:k,tzi_elem_size:24:k,tzi_alloc_size:32:k,tzi_sum_size:40:k,tzi_exhaustible:48:k,tzi_collectable:56:k,tzi_caller_acct:64:k,tzi_task_alloc:72:k,tzi_task_free:80:k
struct termios|72|8|s|1o|c_iflag:0:m,c_oflag:8:m,c_cflag:16:m,c_lflag:24:m,c_cc:32:[20]h,c_ispeed:56:m,c_ospeed:64:m
struct timespec|16|8|s|1p|tv_sec:0:l,tv_nsec:8:l
struct timeval|16|8|s|1q|tv_sec:0:l,tv_usec:8:i
struct timezone|8|4|s|12|tz_minuteswest:0:i,tz_dsttime:4:i
struct tm|56|8|s|1r|tm_sec:0:i,tm_min:4:i,tm_hour:8:i,tm_mday:12:i,tm_mon:16:i,tm_year:20:i,tm_wday:24:i,tm_yday:28:i,tm_isdst:32:i,tm_gmtoff:40:l,tm_zone:48:*c
struct tms|32|8|s|1s|tms_utime:0:m,tms_stime:8:m,tms_cutime:16:m,tms_cstime:24:m
struct utimbuf|16|8|s|1t|actime:0:l,modtime:8:l
struct utsname|1280|1|s|1u|sysname:0:[256]c,nodename:256:[256]c,release:512:[256]c,version:768:[256]c,machine:1024:[256]c
struct vfsconf|40|4|s|o|vfc_reserved1:0:u,vfc_name:4:[15]c,vfc_typenum:20:i,vfc_refcount:24:i,vfc_flags:28:i,vfc_reserved2:32:u,vfc_reserved3:36:u
struct vm_info_object|88|4|s|1v|vio_object:0:u,vio_size:4:u,vio_ref_count:8:u,vio_resident_page_count:12:u,vio_absent_count:16:u,vio_copy:20:u,vio_shadow:24:u,vio_shadow_offset:28:u,vio_paging_offset:32:u,vio_copy_strategy:36:i,vio_last_alloc:40:z,vio_paging_in_progress:48:u,vio_pager_created:52:i,vio_pager_initialized:56:i,vio_pager_ready:60:i,vio_can_persist:64:i,vio_internal:68:i,vio_temporary:72:i,vio_alive:76:i,vio_purgable:80:i,vio_purgable_volatile:84:i
struct vm_info_region|40|4|s|1v|vir_start:0:u,vir_end:4:u,vir_object:8:u,vir_offset:12:u,vir_needs_copy:16:i,vir_protection:20:i,vir_max_protection:24:i,vir_inheritance:28:u,vir_wired_count:32:u,vir_user_wired_count:36:u
struct vm_info_region_64|44|4|s|1v|vir_start:0:u,vir_end:4:u,vir_object:8:u,vir_offset:12:r,vir_needs_copy:20:i,vir_protection:24:i,vir_max_protection:28:i,vir_inheritance:32:u,vir_wired_count:36:u,vir_user_wired_count:40:u
struct vm_purgeable_info|272|8|s|1w|fifo_data:0:[8]@struct vm_purgeable_stat;,obsolete_data:128:@struct vm_purgeable_stat;,lifo_data:144:[8]@struct vm_purgeable_stat;
struct vm_purgeable_stat|16|8|s|1w|count:0:k,size:8:k
struct vm_read_entry|16|4|s|1b|address:0:z,size:8:z
struct winsize|8|2|s|1x|ws_row:0:t,ws_col:2:t,ws_xpixel:4:t,ws_ypixel:6:t
union __sigaction_u|8|8|u|d|__sa_handler:0:p,__sa_sigaction:0:p
union sigval|8|8|u|d|sival_int:0:i,sival_ptr:0:*v
wordexp_t|24|8|s|1y|we_wordc:0:z,we_wordv:8:**c,we_offs:16:z
`,va=`O_CREAT=200
O_EXCL=800
O_NOCTTY=20000
O_TRUNC=400
O_APPEND=8
O_NONBLOCK=4
O_SYNC=80
O_DSYNC=400000
O_DIRECTORY=100000
O_NOFOLLOW=100
O_CLOEXEC=1000000
O_ASYNC=40
O_SHLOCK=10
O_EXLOCK=20
O_EVTONLY=8000
O_SYMLINK=200000
O_ACCMODE=3
O_RDONLY=0
O_WRONLY=1
O_RDWR=2
F_OK=0
R_OK=4
W_OK=2
X_OK=1
SEEK_SET=0
SEEK_CUR=1
SEEK_END=2
SEEK_DATA=4
SEEK_HOLE=3
F_DUPFD=0
F_GETFD=1
F_SETFD=2
F_GETFL=3
F_SETFL=4
F_GETLK=7
F_SETLK=8
F_SETLKW=9
F_GETOWN=5
F_SETOWN=6
F_DUPFD_CLOEXEC=43
F_GETPATH=32
F_FULLFSYNC=33
F_NOCACHE=30
PROT_NONE=0
PROT_READ=1
PROT_WRITE=2
PROT_EXEC=4
MAP_FIXED=10
MAP_ANONYMOUS=1000
MAP_ANON=1000
MAP_NORESERVE=40
MAP_JIT=800
MAP_NOCACHE=400
MAP_32BIT=8000
MAP_SHARED=1
MAP_PRIVATE=2
MS_ASYNC=1
MS_SYNC=10
MS_INVALIDATE=2
MADV_NORMAL=0
MADV_RANDOM=1
MADV_SEQUENTIAL=2
MADV_WILLNEED=3
MADV_DONTNEED=4
MADV_FREE=5
AF_UNSPEC=0
AF_UNIX=1
AF_INET=2
AF_INET6=1e
AF_ROUTE=11
AF_SYSTEM=20
SOCK_STREAM=1
SOCK_DGRAM=2
SOCK_RAW=3
SOCK_RDM=4
SOCK_SEQPACKET=5
IPPROTO_ICMP=1
IPPROTO_IGMP=2
IPPROTO_TCP=6
IPPROTO_UDP=11
IPPROTO_IPV6=29
IPPROTO_ICMPV6=3a
IPPROTO_RAW=ff
IPPROTO_SCTP=84
SOL_SOCKET=ffff
IPPROTO_IP=0
MSG_OOB=1
MSG_PEEK=2
MSG_DONTROUTE=4
MSG_WAITALL=40
MSG_DONTWAIT=80
MSG_NOSIGNAL=80000
MSG_TRUNC=10
MSG_CTRUNC=20
MSG_EOR=8
SHUT_RD=0
SHUT_WR=1
SHUT_RDWR=2
SIGHUP=1
SIGINT=2
SIGQUIT=3
SIGILL=4
SIGTRAP=5
SIGABRT=6
SIGBUS=a
SIGFPE=8
SIGKILL=9
SIGUSR1=1e
SIGSEGV=b
SIGUSR2=1f
SIGPIPE=d
SIGALRM=e
SIGTERM=f
SIGCHLD=14
SIGCONT=13
SIGSTOP=11
SIGTSTP=12
SIGTTIN=15
SIGTTOU=16
SIGURG=10
SIGXCPU=18
SIGXFSZ=19
SIGVTALRM=1a
SIGPROF=1b
SIGWINCH=1c
SIGIO=17
SIGSYS=c
SIGEMT=7
SIGINFO=1d
SIG_DFL=0
SIG_IGN=1
SIG_ERR=-1
SIG_BLOCK=1
SIG_UNBLOCK=2
SIG_SETMASK=3
WNOHANG=1
WUNTRACED=2
WCONTINUED=10
WEXITED=4
WSTOPPED=8
WNOWAIT=20
RTLD_GLOBAL=8
RTLD_LOCAL=4
RTLD_NODELETE=80
RTLD_NOLOAD=10
RTLD_FIRST=100
RTLD_LAZY=1
RTLD_NOW=2
RTLD_DEFAULT=-2
RTLD_NEXT=-1
RTLD_SELF=-3
RTLD_MAIN_ONLY=-5
LOCK_SH=1
LOCK_EX=2
LOCK_NB=4
LOCK_UN=8
CLOCK_REALTIME=0
CLOCK_MONOTONIC=6
CLOCK_PROCESS_CPUTIME_ID=c
CLOCK_THREAD_CPUTIME_ID=10
CLOCK_MONOTONIC_RAW=4
CLOCK_MONOTONIC_COARSE=4
CLOCK_UPTIME_RAW=8
LC_ALL=0
LC_COLLATE=1
LC_CTYPE=2
LC_MONETARY=3
LC_NUMERIC=4
LC_TIME=5
LC_MESSAGES=6
RLIMIT_CPU=0
RLIMIT_FSIZE=1
RLIMIT_DATA=2
RLIMIT_STACK=3
RLIMIT_CORE=4
RLIMIT_RSS=5
RLIMIT_NPROC=7
RLIMIT_NOFILE=8
RLIMIT_MEMLOCK=6
RLIMIT_AS=5
_IOFBF=0
_IOLBF=1
_IONBF=2
_SC_ARG_MAX=1
_SC_CHILD_MAX=2
_SC_CLK_TCK=3
_SC_NGROUPS_MAX=4
_SC_OPEN_MAX=5
_SC_PAGESIZE=1d
_SC_NPROCESSORS_CONF=39
_SC_NPROCESSORS_ONLN=3a
_SC_PHYS_PAGES=c8
_SC_LINE_MAX=f
_SC_HOST_NAME_MAX=48
_SC_GETPW_R_SIZE_MAX=47
_SC_GETGR_R_SIZE_MAX=46
PTHREAD_MUTEX_NORMAL=0
PTHREAD_MUTEX_RECURSIVE=2
PTHREAD_MUTEX_ERRORCHECK=1
PTHREAD_MUTEX_DEFAULT=0
TIOCGWINSZ=40087468
TIOCSWINSZ=80087467
TIOCSCTTY=20007461
TIOCGPGRP=40047477
TIOCSPGRP=80047476
FIONREAD=4004667f
FIONBIO=8004667e
FIOCLEX=20006601
FIONCLEX=20006602
`;var Da=Object.freeze({__proto__:null,constants:va,headers:ya,provenance:Ta,records:Na});const La="zig 0.17.1 (clang 22.1.8) glibc headers, x86_64-linux-gnu",ba=["elf.h","bits/atomic_wide_counter.h","bits/types.h","bits/types/__mbstate_t.h","bits/types/__sigset_t.h","sys/select.h","bits/fenv.h","glob.h","bits/types/sigevent_t.h","bits/pthreadtypes.h","regex.h","bits/types/siginfo_t.h","bits/types/stack_t.h","bits/types/__fpos_t.h","bits/types/struct_FILE.h","bits/thread-shared-types.h","bits/struct_mutex.h","bits/struct_rwlock.h","netdb.h","aio.h","bits/socket.h","bits/dirent.h","link.h","sys/epoll.h","bits/fcntl.h","grp.h","net/if.h","ifaddrs.h","netinet/in.h","sys/inotify.h","bits/types/struct_iovec.h","bits/ipc-perm.h","sys/time.h","locale.h","bits/types/struct_msqid_ds.h","bits/netdb.h","bits/getopt_ext.h","pwd.h","sys/poll.h","bits/resource.h","bits/types/struct_rusage.h","bits/types/struct_sched_param.h","sys/sem.h","bits/types/struct_shmid_ds.h","bits/sigaction.h","sys/un.h","bits/struct_stat.h","bits/statfs.h","bits/statvfs.h","linux/sysinfo.h","bits/termios-struct.h","bits/types/struct_timespec.h","bits/types/struct_timeval.h","bits/types/struct_tm.h","sys/times.h","utime.h","sys/utsname.h","bits/ioctl-types.h","bits/types/__sigval_t.h","wordexp.h"],Oa=`=FILE|struct _IO_FILE
=__darwin_pthread_attr_t|pthread_attr_t
=__darwin_pthread_cond_t|pthread_cond_t
=__darwin_pthread_condattr_t|pthread_condattr_t
=__darwin_pthread_mutex_t|pthread_mutex_t
=__darwin_pthread_mutexattr_t|pthread_mutexattr_t
=__darwin_pthread_rwlock_t|pthread_rwlock_t
=__darwin_pthread_rwlockattr_t|pthread_rwlockattr_t
=fpos_t|struct _G_fpos_t
=regex_t|struct re_pattern_buffer
=sigset_t|__sigset_t
Elf64_Dyn|16|8|s|0|d_tag:0:j,d_un:8:@Elf64_Dyn.d_un;
Elf64_Dyn.d_un|0|0|u|0|d_val:0:k,d_ptr:0:k
Elf64_Ehdr|64|8|s|0|e_ident:0:[16]h,e_type:16:t,e_machine:18:t,e_version:20:u,e_entry:24:k,e_phoff:32:k,e_shoff:40:k,e_flags:48:u,e_ehsize:52:t,e_phentsize:54:t,e_phnum:56:t,e_shentsize:58:t,e_shnum:60:t,e_shstrndx:62:t
Elf64_Phdr|56|8|s|0|p_type:0:u,p_flags:4:u,p_offset:8:k,p_vaddr:16:k,p_paddr:24:k,p_filesz:32:k,p_memsz:40:k,p_align:48:k
Elf64_Rela|24|8|s|0|r_offset:0:k,r_info:8:k,r_addend:16:j
Elf64_Shdr|64|8|s|0|sh_name:0:u,sh_type:4:u,sh_flags:8:k,sh_addr:16:k,sh_offset:24:k,sh_size:32:k,sh_link:40:u,sh_info:44:u,sh_addralign:48:k,sh_entsize:56:k
Elf64_Sym|24|8|s|0|st_name:0:u,st_info:4:h,st_other:5:h,st_shndx:6:t,st_value:8:k,st_size:16:k
__atomic_wide_counter|8|8|u|1|__value64:0:r,__value32:0:@__atomic_wide_counter.__value32;
__atomic_wide_counter.__value32|0|0|s|1|__low:0:u,__high:4:u
__fsid_t|8|4|s|2|__val:0:[2]i
__mbstate_t|8|4|s|3|__count:0:i,__value:4:@__mbstate_t.__value;
__mbstate_t.__value|0|0|u|3|__wch:0:u,__wchb:0:[4]c
__sigset_t|128|8|s|4|__val:0:[16]m
fd_set|128|8|s|5|fds_bits:0:[16]l
fenv_t|32|4|s|6|__control_word:0:t,__glibc_reserved1:2:t,__status_word:4:t,__glibc_reserved2:6:t,__tags:8:t,__glibc_reserved3:10:t,__eip:12:u,__cs_selector:16:t,__data_offset:20:u,__data_selector:24:t,__glibc_reserved5:26:t,__mxcsr:28:u
glob_t|72|8|s|7|gl_pathc:0:m,gl_pathv:8:**c,gl_offs:16:m,gl_flags:24:i,gl_closedir:32:p,gl_readdir:40:p,gl_opendir:48:p,gl_lstat:56:p,gl_stat:64:p
pthread_attr_t|56|8|u|8|__size:0:[56]c,__align:0:l
pthread_cond_t|48|8|u|9|__data:0:@struct __pthread_cond_s;,__size:0:[48]c,__align:0:q
pthread_condattr_t|4|4|u|9|__size:0:[4]c,__align:0:i
pthread_mutex_t|40|8|u|9|__data:0:@struct __pthread_mutex_s;,__size:0:[40]c,__align:0:l
pthread_mutexattr_t|4|4|u|9|__size:0:[4]c,__align:0:i
pthread_rwlock_t|56|8|u|9|__data:0:@struct __pthread_rwlock_arch_t;,__size:0:[56]c,__align:0:l
pthread_rwlockattr_t|8|8|u|9|__size:0:[8]c,__align:0:l
regmatch_t|8|4|s|a|rm_so:0:i,rm_eo:4:i
siginfo_t|128|8|s|b|si_signo:0:i,si_errno:4:i,si_code:8:i,__pad0:12:i,_sifields:16:@siginfo_t._sifields;
siginfo_t._sifields|0|0|u|b|_pad:0:[28]i,_kill:0:@siginfo_t._sifields._kill;,_timer:0:@siginfo_t._sifields._timer;,_rt:0:@siginfo_t._sifields._rt;,_sigchld:0:@siginfo_t._sifields._sigchld;,_sigfault:0:@siginfo_t._sifields._sigfault;,_sigpoll:0:@siginfo_t._sifields._sigpoll;,_sigsys:0:@siginfo_t._sifields._sigsys;
siginfo_t._sifields._kill|0|0|s|b|si_pid:0:i,si_uid:4:u
siginfo_t._sifields._rt|0|0|s|b|si_pid:0:i,si_uid:4:u,si_sigval:8:@union sigval;
siginfo_t._sifields._sigchld|0|0|s|b|si_pid:0:i,si_uid:4:u,si_status:8:i,si_utime:16:l,si_stime:24:l
siginfo_t._sifields._sigfault|0|0|s|b|si_addr:0:*v,si_addr_lsb:8:s,_bounds:16:@siginfo_t._sifields._sigfault._bounds;
siginfo_t._sifields._sigfault._bounds|0|0|u|b|_addr_bnd:0:@siginfo_t._sifields._sigfault._bounds._addr_bnd;,_pkey:0:u
siginfo_t._sifields._sigfault._bounds._addr_bnd|0|0|s|b|_lower:0:*v,_upper:8:*v
siginfo_t._sifields._sigpoll|0|0|s|b|si_band:0:l,si_fd:8:i
siginfo_t._sifields._sigsys|0|0|s|b|_call_addr:0:*v,_syscall:8:i,_arch:12:u
siginfo_t._sifields._timer|0|0|s|b|si_tid:0:i,si_overrun:4:i,si_sigval:8:@union sigval;
stack_t|24|8|s|c|ss_sp:0:*v,ss_flags:8:i,ss_size:16:z
struct _G_fpos_t|16|8|s|d|__pos:0:l,__state:8:@__mbstate_t;
struct _IO_FILE|216|8|s|e|_flags:0:i,_IO_read_ptr:8:*c,_IO_read_end:16:*c,_IO_read_base:24:*c,_IO_write_base:32:*c,_IO_write_ptr:40:*c,_IO_write_end:48:*c,_IO_buf_base:56:*c,_IO_buf_end:64:*c,_IO_save_base:72:*c,_IO_backup_base:80:*c,_IO_save_end:88:*c,_markers:96:*@struct _IO_marker;,_chain:104:*@struct _IO_FILE;,_fileno:112:i,_short_backupbuf:119:[1]c,_old_offset:120:l,_cur_column:128:t,_vtable_offset:130:a,_shortbuf:131:[1]c,_lock:136:*v,_offset:144:l,_codecvt:152:*@struct _IO_codecvt;,_wide_data:160:*@struct _IO_wide_data;,_freeres_list:168:*@struct _IO_FILE;,_freeres_buf:176:*v,_prevchain:184:**@struct _IO_FILE;,_mode:192:i,_unused3:196:i,_total_written:200:k,_unused2:208:[8]c
struct __pthread_cond_s|48|8|s|f|__wseq:0:@__atomic_wide_counter;,__g1_start:8:@__atomic_wide_counter;,__g_size:16:[2]u,__g1_orig_size:24:u,__wrefs:28:u,__g_signals:32:[2]u,__unused_initialized_1:40:u,__unused_initialized_2:44:u
struct __pthread_internal_list|16|8|s|f|__prev:0:*@struct __pthread_internal_list;,__next:8:*@struct __pthread_internal_list;
struct __pthread_mutex_s|40|8|s|g|__lock:0:i,__count:4:u,__owner:8:i,__nusers:12:u,__kind:16:i,__spins:20:s,__glibc_reserved:22:s,__list:24:@struct __pthread_internal_list;
struct __pthread_rwlock_arch_t|56|8|s|h|__readers:0:u,__writers:4:u,__wrphase_futex:8:u,__writers_futex:12:u,__pad3:16:u,__pad4:20:u,__cur_writer:24:i,__shared:28:i,__pad1:32:m,__pad2:40:m,__flags:48:u
struct addrinfo|48|8|s|i|ai_flags:0:i,ai_family:4:i,ai_socktype:8:i,ai_protocol:12:i,ai_addrlen:16:u,ai_addr:24:*@struct sockaddr;,ai_canonname:32:*c,ai_next:40:*@struct addrinfo;
struct aiocb|168|8|s|j|aio_fildes:0:i,aio_lio_opcode:4:i,aio_reqprio:8:i,aio_buf:16:*v,aio_nbytes:24:z,aio_sigevent:32:@struct sigevent;,__next_prio:96:*@struct aiocb;,__abs_prio:104:i,__policy:108:i,__error_code:112:i,__return_value:120:l,aio_offset:128:l,__pad:136:[0]c,__glibc_reserved:136:[32]c
struct cmsghdr|16|8|s|k|cmsg_len:0:z,cmsg_level:8:i,cmsg_type:12:i,__cmsg_data:16:[]h
struct dirent|280|8|s|l|d_ino:0:m,d_off:8:l,d_reclen:16:t,d_type:18:h,d_name:19:[256]c
struct dl_phdr_info|64|8|s|m|dlpi_addr:0:k,dlpi_name:8:^c,dlpi_phdr:16:^@Elf64_Phdr;,dlpi_phnum:24:t,dlpi_adds:32:r,dlpi_subs:40:r,dlpi_tls_modid:48:z,dlpi_tls_data:56:*v
struct epoll_event|16|8|s|n|events:0:u,data:8:@union epoll_data;
struct flock|32|8|s|o|l_type:0:s,l_whence:2:s,l_start:8:l,l_len:16:l,l_pid:24:i
struct group|32|8|s|p|gr_name:0:*c,gr_passwd:8:*c,gr_gid:16:u,gr_mem:24:**c
struct hostent|32|8|s|i|h_name:0:*c,h_aliases:8:**c,h_addrtype:16:i,h_length:20:i,h_addr_list:24:**c
struct if_nameindex|16|8|s|q|if_index:0:u,if_name:8:*c
struct ifaddrs|56|8|s|r|ifa_next:0:*@struct ifaddrs;,ifa_name:8:*c,ifa_flags:16:u,ifa_addr:24:*@struct sockaddr;,ifa_netmask:32:*@struct sockaddr;,ifa_ifu:40:@struct ifaddrs.ifa_ifu;,ifa_data:48:*v
struct ifaddrs.ifa_ifu|0|0|u|r|ifu_broadaddr:0:*@struct sockaddr;,ifu_dstaddr:0:*@struct sockaddr;
struct in6_addr|16|4|s|s|__in6_u:0:@struct in6_addr.__in6_u;
struct in6_addr.__in6_u|0|0|u|s|__u6_addr8:0:[16]h,__u6_addr16:0:[8]t,__u6_addr32:0:[4]u
struct in_addr|4|4|s|s|s_addr:0:u
struct inotify_event|16|4|s|t|wd:0:i,mask:4:u,cookie:8:u,len:12:u,name:16:[]c
struct iovec|16|8|s|u|iov_base:0:*v,iov_len:8:z
struct ip_mreq|8|4|s|s|imr_multiaddr:0:@struct in_addr;,imr_interface:4:@struct in_addr;
struct ipc_perm|48|8|s|v|__key:0:i,uid:4:u,gid:8:u,cuid:12:u,cgid:16:u,mode:20:u,__seq:24:t,__pad2:26:t,__glibc_reserved1:32:m,__glibc_reserved2:40:m
struct itimerval|32|8|s|w|it_interval:0:@struct timeval;,it_value:16:@struct timeval;
struct lconv|96|8|s|x|decimal_point:0:*c,thousands_sep:8:*c,grouping:16:*c,int_curr_symbol:24:*c,currency_symbol:32:*c,mon_decimal_point:40:*c,mon_thousands_sep:48:*c,mon_grouping:56:*c,positive_sign:64:*c,negative_sign:72:*c,int_frac_digits:80:c,frac_digits:81:c,p_cs_precedes:82:c,p_sep_by_space:83:c,n_cs_precedes:84:c,n_sep_by_space:85:c,p_sign_posn:86:c,n_sign_posn:87:c,int_p_cs_precedes:88:c,int_p_sep_by_space:89:c,int_n_cs_precedes:90:c,int_n_sep_by_space:91:c,int_p_sign_posn:92:c,int_n_sign_posn:93:c
struct linger|8|4|s|k|l_onoff:0:i,l_linger:4:i
struct msghdr|56|8|s|k|msg_name:0:*v,msg_namelen:8:u,msg_iov:16:*@struct iovec;,msg_iovlen:24:z,msg_control:32:*v,msg_controllen:40:z,msg_flags:48:i
struct msqid_ds|120|8|s|y|msg_perm:0:@struct ipc_perm;,msg_stime:48:l,msg_rtime:56:l,msg_ctime:64:l,__msg_cbytes:72:m,msg_qnum:80:m,msg_qbytes:88:m,msg_lspid:96:i,msg_lrpid:100:i,__glibc_reserved4:104:m,__glibc_reserved5:112:m
struct netent|24|8|s|z|n_name:0:*c,n_aliases:8:**c,n_addrtype:16:i,n_net:20:u
struct option|32|8|s|10|name:0:^c,has_arg:8:i,flag:16:*i,val:24:i
struct passwd|48|8|s|11|pw_name:0:*c,pw_passwd:8:*c,pw_uid:16:u,pw_gid:20:u,pw_gecos:24:*c,pw_dir:32:*c,pw_shell:40:*c
struct pollfd|8|4|s|12|fd:0:i,events:4:s,revents:6:s
struct protoent|24|8|s|i|p_name:0:*c,p_aliases:8:**c,p_proto:16:i
struct re_pattern_buffer|64|8|s|a|buffer:0:*@struct re_dfa_t;,allocated:8:m,used:16:m,syntax:24:m,fastmap:32:*c,translate:40:*h,re_nsub:48:z
struct rlimit|16|8|s|13|rlim_cur:0:m,rlim_max:8:m
struct rusage|144|8|s|14|ru_utime:0:@struct timeval;,ru_stime:16:@struct timeval;,ru_maxrss:32:l,__ru_maxrss_word:32:l,ru_ixrss:40:l,__ru_ixrss_word:40:l,ru_idrss:48:l,__ru_idrss_word:48:l,ru_isrss:56:l,__ru_isrss_word:56:l,ru_minflt:64:l,__ru_minflt_word:64:l,ru_majflt:72:l,__ru_majflt_word:72:l,ru_nswap:80:l,__ru_nswap_word:80:l,ru_inblock:88:l,__ru_inblock_word:88:l,ru_oublock:96:l,__ru_oublock_word:96:l,ru_msgsnd:104:l,__ru_msgsnd_word:104:l,ru_msgrcv:112:l,__ru_msgrcv_word:112:l,ru_nsignals:120:l,__ru_nsignals_word:120:l,ru_nvcsw:128:l,__ru_nvcsw_word:128:l,ru_nivcsw:136:l,__ru_nivcsw_word:136:l
struct sched_param|4|4|s|15|sched_priority:0:i
struct sembuf|6|2|s|16|sem_num:0:t,sem_op:2:s,sem_flg:4:s
struct servent|32|8|s|i|s_name:0:*c,s_aliases:8:**c,s_port:16:i,s_proto:24:*c
struct shmid_ds|112|8|s|17|shm_perm:0:@struct ipc_perm;,shm_segsz:48:z,shm_atime:56:l,shm_dtime:64:l,shm_ctime:72:l,shm_cpid:80:i,shm_lpid:84:i,shm_nattch:88:m,__glibc_reserved5:96:m,__glibc_reserved6:104:m
struct sigaction|152|8|s|18|__sigaction_handler:0:@struct sigaction.__sigaction_handler;,sa_mask:8:@__sigset_t;,sa_flags:136:i,sa_restorer:144:p
struct sigaction.__sigaction_handler|0|0|u|18|sa_handler:0:p,sa_sigaction:0:p
struct sigevent|64|8|s|8|sigev_value:0:@union sigval;,sigev_signo:8:i,sigev_notify:12:i,_sigev_un:16:@struct sigevent._sigev_un;
struct sigevent._sigev_un|0|0|u|8|_pad:0:[12]i,_tid:0:i,_sigev_thread:0:@struct sigevent._sigev_un._sigev_thread;
struct sigevent._sigev_un._sigev_thread|0|0|s|8|_function:0:p,_attribute:8:*@pthread_attr_t;
struct sockaddr|16|2|s|k|sa_family:0:t,sa_data:2:[14]c
struct sockaddr_in|16|4|s|s|sin_family:0:t,sin_port:2:t,sin_addr:4:@struct in_addr;,sin_zero:8:[8]h
struct sockaddr_in6|28|4|s|s|sin6_family:0:t,sin6_port:2:t,sin6_flowinfo:4:u,sin6_addr:8:@struct in6_addr;,sin6_scope_id:24:u
struct sockaddr_storage|128|8|s|k|ss_family:0:t,__ss_padding:2:[118]c,__ss_align:120:m
struct sockaddr_un|110|2|s|19|sun_family:0:t,sun_path:2:[108]c
struct stat|144|8|s|1a|st_dev:0:m,st_ino:8:m,st_nlink:16:m,st_mode:24:u,st_uid:28:u,st_gid:32:u,__pad0:36:i,st_rdev:40:m,st_size:48:l,st_blksize:56:l,st_blocks:64:l,st_atim:72:@struct timespec;,st_mtim:88:@struct timespec;,st_ctim:104:@struct timespec;,__glibc_reserved:120:[3]l
struct statfs|120|8|s|1b|f_type:0:l,f_bsize:8:l,f_blocks:16:m,f_bfree:24:m,f_bavail:32:m,f_files:40:m,f_ffree:48:m,f_fsid:56:@__fsid_t;,f_namelen:64:l,f_frsize:72:l,f_flags:80:l,f_spare:88:[4]l
struct statvfs|112|8|s|1c|f_bsize:0:m,f_frsize:8:m,f_blocks:16:m,f_bfree:24:m,f_bavail:32:m,f_files:40:m,f_ffree:48:m,f_favail:56:m,f_fsid:64:m,f_flag:72:m,f_namemax:80:m,f_type:88:u,__f_spare:92:[5]i
struct sysinfo|112|8|s|1d|uptime:0:l,loads:8:[3]m,totalram:32:m,freeram:40:m,sharedram:48:m,bufferram:56:m,totalswap:64:m,freeswap:72:m,procs:80:t,pad:82:t,totalhigh:88:m,freehigh:96:m,mem_unit:104:u,_f:108:[0]c
struct termios|60|4|s|1e|c_iflag:0:u,c_oflag:4:u,c_cflag:8:u,c_lflag:12:u,c_line:16:h,c_cc:17:[32]h,__ispeed:52:u,c_ispeed:52:u,__ospeed:56:u,c_ospeed:56:u
struct timespec|16|8|s|1f|tv_sec:0:l,tv_nsec:8:l
struct timeval|16|8|s|1g|tv_sec:0:l,tv_usec:8:l
struct timezone|8|4|s|w|tz_minuteswest:0:i,tz_dsttime:4:i
struct tm|56|8|s|1h|tm_sec:0:i,tm_min:4:i,tm_hour:8:i,tm_mday:12:i,tm_mon:16:i,tm_year:20:i,tm_wday:24:i,tm_yday:28:i,tm_isdst:32:i,tm_gmtoff:40:l,tm_zone:48:^c
struct tms|32|8|s|1i|tms_utime:0:l,tms_stime:8:l,tms_cutime:16:l,tms_cstime:24:l
struct utimbuf|16|8|s|1j|actime:0:l,modtime:8:l
struct utsname|390|1|s|1k|sysname:0:[65]c,nodename:65:[65]c,release:130:[65]c,version:195:[65]c,machine:260:[65]c,domainname:325:[65]c
struct winsize|8|2|s|1l|ws_row:0:t,ws_col:2:t,ws_xpixel:4:t,ws_ypixel:6:t
union epoll_data|8|8|u|n|ptr:0:*v,fd:0:i,u32:0:u,u64:0:k
union sigval|8|8|u|1m|sival_int:0:i,sival_ptr:0:*v
wordexp_t|24|8|s|1n|we_wordc:0:z,we_wordv:8:**c,we_offs:16:z
`,Pa=`O_CREAT=40
O_EXCL=80
O_NOCTTY=100
O_TRUNC=200
O_APPEND=400
O_NONBLOCK=800
O_SYNC=101000
O_DSYNC=1000
O_DIRECTORY=10000
O_NOFOLLOW=20000
O_CLOEXEC=80000
O_DIRECT=4000
O_NOATIME=40000
O_PATH=200000
O_TMPFILE=410000
O_ASYNC=2000
O_ACCMODE=3
O_RDONLY=0
O_WRONLY=1
O_RDWR=2
F_OK=0
R_OK=4
W_OK=2
X_OK=1
SEEK_SET=0
SEEK_CUR=1
SEEK_END=2
SEEK_DATA=3
SEEK_HOLE=4
F_DUPFD=0
F_GETFD=1
F_SETFD=2
F_GETFL=3
F_SETFL=4
F_GETLK=5
F_SETLK=6
F_SETLKW=7
F_GETOWN=9
F_SETOWN=8
F_DUPFD_CLOEXEC=406
F_SETPIPE_SZ=407
F_GETPIPE_SZ=408
PROT_NONE=0
PROT_READ=1
PROT_WRITE=2
PROT_EXEC=4
MAP_FIXED=10
MAP_ANONYMOUS=20
MAP_ANON=20
MAP_NORESERVE=4000
MAP_POPULATE=8000
MAP_GROWSDOWN=100
MAP_STACK=20000
MAP_HUGETLB=40000
MAP_LOCKED=2000
MAP_NONBLOCK=10000
MAP_FIXED_NOREPLACE=100000
MAP_32BIT=40
MAP_TYPE=f
MAP_SHARED=1
MAP_PRIVATE=2
MAP_SHARED_VALIDATE=3
MS_ASYNC=1
MS_SYNC=4
MS_INVALIDATE=2
MADV_NORMAL=0
MADV_RANDOM=1
MADV_SEQUENTIAL=2
MADV_WILLNEED=3
MADV_DONTNEED=4
MADV_FREE=8
MADV_REMOVE=9
MADV_DONTFORK=a
MADV_DOFORK=b
MADV_HUGEPAGE=e
MADV_NOHUGEPAGE=f
AF_UNSPEC=0
AF_UNIX=1
AF_INET=2
AF_INET6=a
AF_NETLINK=10
AF_PACKET=11
AF_ROUTE=10
AF_BLUETOOTH=1f
SOCK_NONBLOCK=800
SOCK_CLOEXEC=80000
SOCK_STREAM=1
SOCK_DGRAM=2
SOCK_RAW=3
SOCK_RDM=4
SOCK_SEQPACKET=5
IPPROTO_ICMP=1
IPPROTO_IGMP=2
IPPROTO_TCP=6
IPPROTO_UDP=11
IPPROTO_IPV6=29
IPPROTO_ICMPV6=3a
IPPROTO_RAW=ff
IPPROTO_SCTP=84
SOL_SOCKET=1
IPPROTO_IP=0
MSG_OOB=1
MSG_PEEK=2
MSG_DONTROUTE=4
MSG_WAITALL=100
MSG_DONTWAIT=40
MSG_NOSIGNAL=4000
MSG_TRUNC=20
MSG_CTRUNC=8
MSG_EOR=80
MSG_MORE=8000
MSG_CMSG_CLOEXEC=40000000
SHUT_RD=0
SHUT_WR=1
SHUT_RDWR=2
SIGHUP=1
SIGINT=2
SIGQUIT=3
SIGILL=4
SIGTRAP=5
SIGABRT=6
SIGBUS=7
SIGFPE=8
SIGKILL=9
SIGUSR1=a
SIGSEGV=b
SIGUSR2=c
SIGPIPE=d
SIGALRM=e
SIGTERM=f
SIGSTKFLT=10
SIGCHLD=11
SIGCONT=12
SIGSTOP=13
SIGTSTP=14
SIGTTIN=15
SIGTTOU=16
SIGURG=17
SIGXCPU=18
SIGXFSZ=19
SIGVTALRM=1a
SIGPROF=1b
SIGWINCH=1c
SIGIO=1d
SIGPWR=1e
SIGSYS=1f
SIG_DFL=0
SIG_IGN=1
SIG_ERR=-1
SIG_BLOCK=0
SIG_UNBLOCK=1
SIG_SETMASK=2
WNOHANG=1
WUNTRACED=2
WCONTINUED=8
WEXITED=4
WSTOPPED=2
WNOWAIT=1000000
RTLD_GLOBAL=100
RTLD_LOCAL=0
RTLD_NODELETE=1000
RTLD_NOLOAD=4
RTLD_DEEPBIND=8
RTLD_BINDING_MASK=3
RTLD_LAZY=1
RTLD_NOW=2
RTLD_DEFAULT=0
RTLD_NEXT=-1
LOCK_SH=1
LOCK_EX=2
LOCK_NB=4
LOCK_UN=8
CLOCK_REALTIME=0
CLOCK_MONOTONIC=1
CLOCK_PROCESS_CPUTIME_ID=2
CLOCK_THREAD_CPUTIME_ID=3
CLOCK_MONOTONIC_RAW=4
CLOCK_REALTIME_COARSE=5
CLOCK_MONOTONIC_COARSE=6
CLOCK_BOOTTIME=7
LC_ALL=6
LC_COLLATE=3
LC_CTYPE=0
LC_MONETARY=4
LC_NUMERIC=1
LC_TIME=2
LC_MESSAGES=5
RLIMIT_CPU=0
RLIMIT_FSIZE=1
RLIMIT_DATA=2
RLIMIT_STACK=3
RLIMIT_CORE=4
RLIMIT_RSS=5
RLIMIT_NPROC=6
RLIMIT_NOFILE=7
RLIMIT_MEMLOCK=8
RLIMIT_AS=9
_IOFBF=0
_IOLBF=1
_IONBF=2
_SC_ARG_MAX=0
_SC_CHILD_MAX=1
_SC_CLK_TCK=2
_SC_NGROUPS_MAX=3
_SC_OPEN_MAX=4
_SC_PAGESIZE=1e
_SC_NPROCESSORS_CONF=53
_SC_NPROCESSORS_ONLN=54
_SC_PHYS_PAGES=55
_SC_LINE_MAX=2b
_SC_HOST_NAME_MAX=b4
_SC_GETPW_R_SIZE_MAX=46
_SC_GETGR_R_SIZE_MAX=45
EPOLL_CTL_ADD=1
EPOLL_CTL_DEL=2
EPOLL_CTL_MOD=3
EPOLL_CLOEXEC=80000
EFD_NONBLOCK=800
EFD_SEMAPHORE=1
PTHREAD_MUTEX_NORMAL=0
PTHREAD_MUTEX_RECURSIVE=1
PTHREAD_MUTEX_ERRORCHECK=2
PTHREAD_MUTEX_DEFAULT=0
PTRACE_TRACEME=0
PTRACE_PEEKTEXT=1
PTRACE_PEEKDATA=2
PTRACE_POKETEXT=4
PTRACE_POKEDATA=5
PTRACE_CONT=7
PTRACE_KILL=8
PTRACE_SINGLESTEP=9
PTRACE_GETREGS=c
PTRACE_SETREGS=d
PTRACE_ATTACH=10
PTRACE_DETACH=11
PTRACE_SYSCALL=18
PTRACE_SEIZE=4206
PT_TRACE_ME=0
PT_ATTACH=10
PT_DETACH=11
PT_CONTINUE=7
PR_SET_PDEATHSIG=1
PR_GET_PDEATHSIG=2
PR_SET_DUMPABLE=4
PR_GET_DUMPABLE=3
PR_SET_NAME=f
PR_GET_NAME=10
PR_SET_SECCOMP=16
PR_SET_NO_NEW_PRIVS=26
PR_SET_PTRACER=59616d61
TCGETS=5401
TCSETS=5402
TIOCGWINSZ=5413
TIOCSWINSZ=5414
TIOCSCTTY=540e
TIOCGPGRP=540f
TIOCSPGRP=5410
FIONREAD=541b
FIONBIO=5421
FIOCLEX=5451
FIONCLEX=5450
FILE_WRITE_ATTRIBUTES=92
`;var ka=Object.freeze({__proto__:null,constants:Pa,headers:ba,provenance:La,records:Oa});const Ma="zig 0.17.1 (clang 22.1.8) mingw-w64 headers, x86_64-w64-mingw32",xa=["shellapi.h","shlobj.h","winbase.h","fileapi.h","_mingw_unicode.h","winuser.h","rpc.h","winnt.h","stdlib.h","wchar.h","corecrt_startup.h","psdk_inc/_fd_types.h","ws2tcpip.h","combaseapi.h","psdk_inc/_wsadata.h","wingdi.h","consoleapi2.h","wincontypes.h","consoleapi3.h","consoleapi.h","guiddef.h","heapapi.h","shtypes.h","sysinfoapi.h","psapi.h","minwinbase.h","winternl.h","winsock2.h","ws2def.h","processthreadsapi.h","timezoneapi.h","memoryapi.h","io.h","sys/timeb.h","winnls.h","direct.h","qos.h","malloc.h","stdio.h","_mingw_stat64.h","wtypes.h","psdk_inc/_ip_types.h","in6addr.h","inaddr.h","locale.h","corecrt.h","ws2ipdef.h","sys/stat.h","tlhelp32.h","sys/types.h","_timeval.h","time.h"],Ha=`=ACL|struct _ACL
=ACTCTXA|struct tagACTCTXA
=ACTCTXW|struct tagACTCTXW
=ADDRINFOA|struct addrinfo
=ADDRINFOEXA|struct addrinfoexA
=ADDRINFOEXW|struct addrinfoexW
=ADDRINFOW|struct addrinfoW
=BLENDFUNCTION|struct _BLENDFUNCTION
=BSTRBLOB|struct tagBSTRBLOB
=BY_HANDLE_FILE_INFORMATION|struct _BY_HANDLE_FILE_INFORMATION
=CLIPDATA|struct tagCLIPDATA
=CLSID|struct _GUID
=CONSOLE_CURSOR_INFO|struct _CONSOLE_CURSOR_INFO
=CONTEXT|struct _CONTEXT
=CRITICAL_SECTION|struct _RTL_CRITICAL_SECTION
=CSFV|struct _CSFV
=CURRENCYFMTA|struct _currencyfmtA
=CURRENCYFMTW|struct _currencyfmtW
=CY|union tagCY
=DECIMAL|struct tagDEC
=DEVMODEA|struct _devicemodeA
=DEVMODEW|struct _devicemodeW
=DVTARGETDEVICE|struct tagDVTARGETDEVICE
=DYNAMIC_TIME_ZONE_INFORMATION|struct _TIME_DYNAMIC_ZONE_INFORMATION
=EXCEPTION_POINTERS|struct _EXCEPTION_POINTERS
=EXCEPTION_RECORD|struct _EXCEPTION_RECORD
=FILE|struct _iobuf
=FILETIME|struct _FILETIME
=FILE_SEGMENT_ELEMENT|union _FILE_SEGMENT_ELEMENT
=FORMATETC|struct tagFORMATETC
=GENERIC_MAPPING|struct _GENERIC_MAPPING
=GROUP_AFFINITY|struct _GROUP_AFFINITY
=GUID|struct _GUID
=HARDWARE_COUNTER_DATA|struct _HARDWARE_COUNTER_DATA
=HEAPENTRY32|struct tagHEAPENTRY32
=HEAPLIST32|struct tagHEAPLIST32
=ICONINFO|struct _ICONINFO
=IMAGE_DATA_DIRECTORY|struct _IMAGE_DATA_DIRECTORY
=IMAGE_DOS_HEADER|struct _IMAGE_DOS_HEADER
=IMAGE_EXPORT_DIRECTORY|struct _IMAGE_EXPORT_DIRECTORY
=IMAGE_IMPORT_DESCRIPTOR|struct _IMAGE_IMPORT_DESCRIPTOR
=IMAGE_NT_HEADERS64|struct _IMAGE_NT_HEADERS64
=IMAGE_SECTION_HEADER|struct _IMAGE_SECTION_HEADER
=INPUT_MESSAGE_SOURCE|struct tagINPUT_MESSAGE_SOURCE
=INPUT_RECORD|struct _INPUT_RECORD
=INPUT_TRANSFORM|struct tagINPUT_TRANSFORM
=IO_COUNTERS|struct _IO_COUNTERS
=ITEMIDLIST|struct _ITEMIDLIST
=LARGE_INTEGER|union _LARGE_INTEGER
=LIST_ENTRY|struct _LIST_ENTRY
=LUID|struct _LUID
=LUID_AND_ATTRIBUTES|struct _LUID_AND_ATTRIBUTES
=M128A|struct _M128A
=MEMORY_BASIC_INFORMATION|struct _MEMORY_BASIC_INFORMATION
=MENUINFO|struct tagMENUINFO
=MENUITEMINFOA|struct tagMENUITEMINFOA
=MENUITEMINFOW|struct tagMENUITEMINFOW
=MODULEENTRY32|struct tagMODULEENTRY32
=MODULEENTRY32W|struct tagMODULEENTRY32W
=MSG|struct tagMSG
=MSGBOXPARAMSA|struct tagMSGBOXPARAMSA
=MSGBOXPARAMSW|struct tagMSGBOXPARAMSW
=NOTIFYICONDATAW|struct _NOTIFYICONDATAW
=NOTIFYICONIDENTIFIER|struct _NOTIFYICONIDENTIFIER
=NUMBERFMTA|struct _numberfmtA
=NUMBERFMTW|struct _numberfmtW
=OPENASINFO|struct _openasinfo
=OPERATION_END_PARAMETERS|struct _OPERATION_END_PARAMETERS
=OPERATION_START_PARAMETERS|struct _OPERATION_START_PARAMETERS
=OSVERSIONINFOEXW|struct _OSVERSIONINFOEXW
=OVERLAPPED|struct _OVERLAPPED
=PAINTSTRUCT|struct tagPAINTSTRUCT
=PEB|struct _PEB
=POINT|struct tagPOINT
=POINTER_DEVICE_CURSOR_INFO|struct tagPOINTER_DEVICE_CURSOR_INFO
=POINTER_DEVICE_INFO|struct tagPOINTER_DEVICE_INFO
=POINTER_DEVICE_PROPERTY|struct tagPOINTER_DEVICE_PROPERTY
=POINTER_INFO|struct tagPOINTER_INFO
=POINTER_PEN_INFO|struct tagPOINTER_PEN_INFO
=POINTER_TOUCH_INFO|struct tagPOINTER_TOUCH_INFO
=POINTER_TYPE_INFO|struct tagPOINTER_TYPE_INFO
=PROCESSENTRY32|struct tagPROCESSENTRY32
=PROCESSENTRY32W|struct tagPROCESSENTRY32W
=PROCESSOR_GROUP_INFO|struct _PROCESSOR_GROUP_INFO
=PROCESS_INFORMATION|struct _PROCESS_INFORMATION
=PROCESS_MEMORY_COUNTERS|struct _PROCESS_MEMORY_COUNTERS
=PROPERTYKEY|struct _tagpropertykey
=PROPSPEC|struct tagPROPSPEC
=PROPVARIANT|struct tagPROPVARIANT
=RAWINPUTDEVICE|struct tagRAWINPUTDEVICE
=RECT|struct tagRECT
=RTL_CONDITION_VARIABLE|struct _RTL_CONDITION_VARIABLE
=RTL_SRWLOCK|struct _RTL_SRWLOCK
=SAFEARRAY|struct tagSAFEARRAY
=SAFEARRAYBOUND|struct tagSAFEARRAYBOUND
=SCROLLINFO|struct tagSCROLLINFO
=SECURITY_ATTRIBUTES|struct _SECURITY_ATTRIBUTES
=SERVICE_TABLE_ENTRYA|struct _SERVICE_TABLE_ENTRYA
=SERVICE_TABLE_ENTRYW|struct _SERVICE_TABLE_ENTRYW
=SFV_CREATE|struct _SFV_CREATE
=SHChangeNotifyEntry|struct _SHChangeNotifyEntry
=SHELLEXECUTEINFOA|struct _SHELLEXECUTEINFOA
=SHELLEXECUTEINFOW|struct _SHELLEXECUTEINFOW
=SHFILEINFOA|struct _SHFILEINFOA
=SHFILEINFOW|struct _SHFILEINFOW
=SHITEMID|struct _SHITEMID
=SHSTOCKICONINFO|struct _SHSTOCKICONINFO
=SID_AND_ATTRIBUTES|struct _SID_AND_ATTRIBUTES
=SIZE|struct tagSIZE
=SMALL_RECT|struct _SMALL_RECT
=SOCKADDR|struct sockaddr
=SOCKADDR_IN|struct sockaddr_in
=SOCKADDR_IN6|struct sockaddr_in6
=SOCKET_ADDRESS|struct _SOCKET_ADDRESS
=STARTUPINFOA|struct _STARTUPINFOA
=STARTUPINFOW|struct _STARTUPINFOW
=SYSTEMTIME|struct _SYSTEMTIME
=SYSTEM_INFO|struct _SYSTEM_INFO
=TEB|struct _TEB
=THREADENTRY32|struct tagTHREADENTRY32
=TIMEVAL|struct timeval
=TIME_ZONE_INFORMATION|struct _TIME_ZONE_INFORMATION
=TOKEN_PRIVILEGES|struct _TOKEN_PRIVILEGES
=TOUCH_HIT_TESTING_INPUT|struct tagTOUCH_HIT_TESTING_INPUT
=TOUCH_HIT_TESTING_PROXIMITY_EVALUATION|struct tagTOUCH_HIT_TESTING_PROXIMITY_EVALUATION
=TPMPARAMS|struct tagTPMPARAMS
=TP_CALLBACK_ENVIRON_V3|struct _TP_CALLBACK_ENVIRON_V3
=ULARGE_INTEGER|union _ULARGE_INTEGER
=UNICODE_STRING|struct _UNICODE_STRING
=UNWIND_HISTORY_TABLE_ENTRY|struct _UNWIND_HISTORY_TABLE_ENTRY
=UPDATELAYEREDWINDOWINFO|struct tagUPDATELAYEREDWINDOWINFO
=VARIANT|struct tagVARIANT
=WIN32_FIND_DATAA|struct _WIN32_FIND_DATAA
=WIN32_FIND_DATAW|struct _WIN32_FIND_DATAW
=WINDOWPLACEMENT|struct tagWINDOWPLACEMENT
=WNDCLASSA|struct tagWNDCLASSA
=WNDCLASSEXA|struct tagWNDCLASSEXA
=WNDCLASSEXW|struct tagWNDCLASSEXW
=WNDCLASSW|struct tagWNDCLASSW
=WOW64_CONTEXT|struct _WOW64_CONTEXT
=WSADATA|struct WSAData
=WSAPOLLFD|struct pollfd
=_HEAPINFO|struct _heapinfo
ASSOCIATIONELEMENT|24|8|s|0|ac:0:i,hkClass:8:*@struct HKEY__;,pszClass:16:^w
AUTO_SCROLL_DATA|48|1|s|1|iNextSample:0:i,dwLastScroll:4:m,bFull:8:i,pts:12:[3]@struct tagPOINT;,dwTimes:36:[3]m
CABINETSTATE|12|1|s|1|cLength:0:t,nVersion:2:t,fMenuEnumFilter:8:u
COPYFILE2_EXTENDED_PARAMETERS|32|8|s|2|dwSize:0:m,dwCopyFlags:4:m,pfCancel:8:*i,pProgressRoutine:16:p,pvCallbackContext:24:*v
DEFCONTEXTMENU|72|8|s|1|hwnd:0:*@struct HWND__;,pcmcb:8:*@IContextMenuCB;,pidlFolder:16:^@struct _ITEMIDLIST;,psf:24:*@IShellFolder;,cidl:32:u,apidl:40:*^@struct _ITEMIDLIST;,punkAssociationInfo:48:*@IUnknown;,cKeys:56:u,aKeys:64:^*@struct HKEY__;
DISK_SPACE_INFORMATION|96|8|s|3|ActualTotalAllocationUnits:0:r,ActualAvailableAllocationUnits:8:r,ActualPoolUnavailableAllocationUnits:16:r,CallerTotalAllocationUnits:24:r,CallerAvailableAllocationUnits:32:r,CallerPoolUnavailableAllocationUnits:40:r,UsedAllocationUnits:48:r,TotalReservedAllocationUnits:56:r,VolumeStorageReserveAllocationUnits:64:r,AvailableCommittedAllocationUnits:72:r,PoolAvailableAllocationUnits:80:r,SectorsPerAllocationUnit:88:m,BytesPerSector:92:m
DISPLAYCONFIG_DEVICE_INFO_HEADER|20|4|s|4|type:0:i,size:4:u,adapterId:8:@struct _LUID;,id:16:u
DISPLAYCONFIG_MODE_INFO|64|8|s|4|infoType:0:i,id:4:u,adapterId:8:@struct _LUID;,targetMode:16:@struct DISPLAYCONFIG_TARGET_MODE;,sourceMode:16:@struct DISPLAYCONFIG_SOURCE_MODE;
DISPLAYCONFIG_PATH_INFO|72|4|s|4|sourceInfo:0:@struct DISPLAYCONFIG_PATH_SOURCE_INFO;,targetInfo:20:@struct DISPLAYCONFIG_PATH_TARGET_INFO;,flags:68:u
DLGTEMPLATE|18|2|s|5|style:0:m,dwExtendedStyle:4:m,cdit:8:t,x:10:s,y:12:s,cx:14:s,cy:16:s
IBindCtx|8|8|s|6|lpVtbl:0:*@IBindCtxVtbl;
IBindCtxVtbl|104|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,RegisterObjectBound:24:p,RevokeObjectBound:32:p,ReleaseBoundObjects:40:p,SetBindOptions:48:p,GetBindOptions:56:p,GetRunningObjectTable:64:p,RegisterObjectParam:72:p,GetObjectParam:80:p,EnumObjectParam:88:p,RevokeObjectParam:96:p
IContextMenu|8|8|s|6|lpVtbl:0:*@IContextMenuVtbl;
IContextMenuCB|8|8|s|6|lpVtbl:0:*@IContextMenuCBVtbl;
IContextMenuCBVtbl|32|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,CallBack:24:p
IContextMenuVtbl|48|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,QueryContextMenu:24:p,InvokeCommand:32:p,GetCommandString:40:p
IDataObject|8|8|s|6|lpVtbl:0:*@IDataObjectVtbl;
IDataObjectVtbl|96|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,GetData:24:p,GetDataHere:32:p,QueryGetData:40:p,GetCanonicalFormatEtc:48:p,SetData:56:p,EnumFormatEtc:64:p,DAdvise:72:p,DUnadvise:80:p,EnumDAdvise:88:p
IDispatch|8|8|s|6|lpVtbl:0:*@IDispatchVtbl;
IDispatchVtbl|56|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,GetTypeInfoCount:24:p,GetTypeInfo:32:p,GetIDsOfNames:40:p,Invoke:48:p
IDropSource|8|8|s|6|lpVtbl:0:*@IDropSourceVtbl;
IDropSourceVtbl|40|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,QueryContinueDrag:24:p,GiveFeedback:32:p
IEnumAssocHandlers|8|8|s|6|lpVtbl:0:*@IEnumAssocHandlersVtbl;
IEnumAssocHandlersVtbl|32|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,Next:24:p
IEnumFORMATETC|8|8|s|6|lpVtbl:0:*@IEnumFORMATETCVtbl;
IEnumFORMATETCVtbl|56|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,Next:24:p,Skip:32:p,Reset:40:p,Clone:48:p
IFileOperation|8|8|s|6|lpVtbl:0:*@IFileOperationVtbl;
IFileOperationProgressSink|8|8|s|6|lpVtbl:0:*@IFileOperationProgressSinkVtbl;
IFileOperationProgressSinkVtbl|152|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,StartOperations:24:p,FinishOperations:32:p,PreRenameItem:40:p,PostRenameItem:48:p,PreMoveItem:56:p,PostMoveItem:64:p,PreCopyItem:72:p,PostCopyItem:80:p,PreDeleteItem:88:p,PostDeleteItem:96:p,PreNewItem:104:p,PostNewItem:112:p,UpdateProgress:120:p,ResetTimer:128:p,PauseTimer:136:p,ResumeTimer:144:p
IFileOperationVtbl|184|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,Advise:24:p,Unadvise:32:p,SetOperationFlags:40:p,SetProgressMessage:48:p,SetProgressDialog:56:p,SetProperties:64:p,SetOwnerWindow:72:p,ApplyPropertiesToItem:80:p,ApplyPropertiesToItems:88:p,RenameItem:96:p,RenameItems:104:p,MoveItem:112:p,MoveItems:120:p,CopyItem:128:p,CopyItems:136:p,DeleteItem:144:p,DeleteItems:152:p,NewItem:160:p,PerformOperations:168:p,GetAnyOperationsAborted:176:p
IMalloc|8|8|s|6|lpVtbl:0:*@IMallocVtbl;
IMallocVtbl|72|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,Alloc:24:p,Realloc:32:p,Free:40:p,GetSize:48:p,DidAlloc:56:p,HeapMinimize:64:p
IMoniker|8|8|s|6|lpVtbl:0:*@IMonikerVtbl;
IMonikerVtbl|184|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,GetClassID:24:p,IsDirty:32:p,Load:40:p,Save:48:p,GetSizeMax:56:p,BindToObject:64:p,BindToStorage:72:p,Reduce:80:p,ComposeWith:88:p,Enum:96:p,IsEqual:104:p,Hash:112:p,IsRunning:120:p,GetTimeOfLastChange:128:p,Inverse:136:p,CommonPrefixWith:144:p,RelativePathTo:152:p,GetDisplayName:160:p,ParseDisplayName:168:p,IsSystemMoniker:176:p
IPropertySetStorage|8|8|s|6|lpVtbl:0:*@IPropertySetStorageVtbl;
IPropertySetStorageVtbl|56|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,Create:24:p,Open:32:p,Delete:40:p,Enum:48:p
IPropertyStorage|8|8|s|6|lpVtbl:0:*@IPropertyStorageVtbl;
IPropertyStorageVtbl|120|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,ReadMultiple:24:p,WriteMultiple:32:p,DeleteMultiple:40:p,ReadPropertyNames:48:p,WritePropertyNames:56:p,DeletePropertyNames:64:p,Commit:72:p,Revert:80:p,Enum:88:p,SetTimes:96:p,SetClass:104:p,Stat:112:p
IPropertyStore|8|8|s|6|lpVtbl:0:*@IPropertyStoreVtbl;
IPropertyStoreVtbl|64|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,GetCount:24:p,GetAt:32:p,GetValue:40:p,SetValue:48:p,Commit:56:p
IRecordInfo|8|8|s|6|lpVtbl:0:*@IRecordInfoVtbl;
IRecordInfoVtbl|152|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,RecordInit:24:p,RecordClear:32:p,RecordCopy:40:p,GetGuid:48:p,GetName:56:p,GetSize:64:p,GetTypeInfo:72:p,GetField:80:p,GetFieldNoCopy:88:p,PutField:96:p,PutFieldNoCopy:104:p,GetFieldNames:112:p,IsMatchingType:120:p,RecordCreate:128:p,RecordCreateCopy:136:p,RecordDestroy:144:p
IShellBrowser|8|8|s|6|lpVtbl:0:*@IShellBrowserVtbl;
IShellBrowserVtbl|144|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,GetWindow:24:p,ContextSensitiveHelp:32:p,InsertMenusSB:40:p,SetMenuSB:48:p,RemoveMenusSB:56:p,SetStatusTextSB:64:p,EnableModelessSB:72:p,TranslateAcceleratorSB:80:p,BrowseObject:88:p,GetViewStateStream:96:p,GetControlWindow:104:p,SendControlMsg:112:p,QueryActiveShellView:120:p,OnViewWindowActive:128:p,SetToolbarItems:136:p
IShellFolder|8|8|s|6|lpVtbl:0:*@IShellFolderVtbl;
IShellFolderViewCB|8|1|s|6|lpVtbl:0:*@struct IShellFolderViewCBVtbl;
IShellFolderVtbl|104|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,ParseDisplayName:24:p,EnumObjects:32:p,BindToObject:40:p,BindToStorage:48:p,CompareIDs:56:p,CreateViewObject:64:p,GetAttributesOf:72:p,GetUIObjectOf:80:p,GetDisplayNameOf:88:p,SetNameOf:96:p
IShellItem|8|8|s|6|lpVtbl:0:*@IShellItemVtbl;
IShellItemArray|8|8|s|6|lpVtbl:0:*@IShellItemArrayVtbl;
IShellItemArrayVtbl|80|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,BindToHandler:24:p,GetPropertyStore:32:p,GetPropertyDescriptionList:40:p,GetAttributes:48:p,GetCount:56:p,GetItemAt:64:p,EnumItems:72:p
IShellItemVtbl|64|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,BindToHandler:24:p,GetParent:32:p,GetDisplayName:40:p,GetAttributes:48:p,Compare:56:p
IShellView|8|8|s|6|lpVtbl:0:*@IShellViewVtbl;
IShellViewVtbl|128|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,GetWindow:24:p,ContextSensitiveHelp:32:p,TranslateAcceleratorA:40:p,EnableModeless:48:p,UIActivate:56:p,Refresh:64:p,CreateViewWindow:72:p,DestroyViewWindow:80:p,GetCurrentInfo:88:p,AddPropertySheetPages:96:p,SaveViewState:104:p,SelectItem:112:p,GetItemObject:120:p
IStorage|8|8|s|6|lpVtbl:0:*@IStorageVtbl;
IStorageVtbl|144|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,CreateStream:24:p,OpenStream:32:p,CreateStorage:40:p,OpenStorage:48:p,CopyTo:56:p,MoveElementTo:64:p,Commit:72:p,Revert:80:p,EnumElements:88:p,DestroyElement:96:p,RenameElement:104:p,SetElementTimes:112:p,SetClass:120:p,SetStateBits:128:p,Stat:136:p
IStream|8|8|s|6|lpVtbl:0:*@IStreamVtbl;
IStreamVtbl|112|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p,Read:24:p,Write:32:p,Seek:40:p,SetSize:48:p,CopyTo:56:p,Commit:64:p,Revert:72:p,LockRegion:80:p,UnlockRegion:88:p,Stat:96:p,Clone:104:p
IUnknown|8|8|s|6|lpVtbl:0:*@IUnknownVtbl;
IUnknownVtbl|24|8|s|7|QueryInterface:0:p,AddRef:8:p,Release:16:p
SHELLFLAGSTATE|4|1|s|1|
_CRT_DOUBLE|8|8|s|8|x:0:d
_CRT_FLOAT|4|4|s|8|f:0:f
_LDOUBLE|10|1|s|8|ld:0:[10]h
_Mbstatet|8|4|s|9|_Wchar:0:m,_Byte:4:t,_State:6:t
_onexit_table_t|24|8|s|a|_first:0:*p,_last:8:*p,_end:16:*p
fd_set|520|8|s|b|fd_count:0:u,fd_array:8:[64]r
struct DISPLAYCONFIG_2DREGION|8|4|s|4|cx:0:u,cy:4:u
struct DISPLAYCONFIG_PATH_SOURCE_INFO|20|4|s|4|adapterId:0:@struct _LUID;,id:8:u,modeInfoIdx:12:u,statusFlags:16:u
struct DISPLAYCONFIG_PATH_TARGET_INFO|48|4|s|4|adapterId:0:@struct _LUID;,id:8:u,modeInfoIdx:12:u,outputTechnology:16:i,rotation:20:i,scaling:24:i,refreshRate:28:@struct DISPLAYCONFIG_RATIONAL;,scanLineOrdering:36:i,targetAvailable:40:i,statusFlags:44:u
struct DISPLAYCONFIG_RATIONAL|8|4|s|4|Numerator:0:u,Denominator:4:u
struct DISPLAYCONFIG_SOURCE_MODE|20|4|s|4|width:0:u,height:4:u,pixelFormat:8:i,position:12:@struct _POINTL;
struct DISPLAYCONFIG_TARGET_MODE|48|8|s|4|targetVideoSignalInfo:0:@struct DISPLAYCONFIG_VIDEO_SIGNAL_INFO;
struct DISPLAYCONFIG_VIDEO_SIGNAL_INFO|48|8|s|4|pixelRate:0:r,hSyncFreq:8:@struct DISPLAYCONFIG_RATIONAL;,vSyncFreq:16:@struct DISPLAYCONFIG_RATIONAL;,activeSize:24:@struct DISPLAYCONFIG_2DREGION;,totalSize:32:@struct DISPLAYCONFIG_2DREGION;,AdditionalSignalInfo:40:@struct DISPLAYCONFIG_VIDEO_SIGNAL_INFO.AdditionalSignalInfo;,videoStandard:40:u,scanLineOrdering:44:i
struct DISPLAYCONFIG_VIDEO_SIGNAL_INFO.AdditionalSignalInfo|0|0|s|4|
struct DPI_AWARENESS_CONTEXT__|4|4|s|7|unused:0:i
struct FILE_ID_DESCRIPTOR|24|8|s|2|dwSize:0:m,Type:4:i,FileId:8:@union _LARGE_INTEGER;,ObjectId:8:@struct _GUID;,ExtendedFileId:8:@struct _FILE_ID_128;
struct HACCEL__|4|4|s|7|unused:0:i
struct HBITMAP__|4|4|s|7|unused:0:i
struct HBRUSH__|4|4|s|7|unused:0:i
struct HDC__|4|4|s|7|unused:0:i
struct HDESK__|4|4|s|7|unused:0:i
struct HDROP__|4|4|s|c|unused:0:i
struct HGESTUREINFO__|4|4|s|5|unused:0:i
struct HHOOK__|4|4|s|7|unused:0:i
struct HICON__|4|4|s|7|unused:0:i
struct HINSTANCE__|4|4|s|7|unused:0:i
struct HKEY__|4|4|s|7|unused:0:i
struct HKL__|4|4|s|7|unused:0:i
struct HMENU__|4|4|s|7|unused:0:i
struct HMONITOR__|4|4|s|7|unused:0:i
struct HPSXA__|4|1|s|1|unused:0:i
struct HRAWINPUT__|4|4|s|5|unused:0:i
struct HRGN__|4|4|s|7|unused:0:i
struct HRSRC__|4|4|s|7|unused:0:i
struct HSYNTHETICPOINTERDEVICE__|4|4|s|5|unused:0:i
struct HTOUCHINPUT__|4|4|s|5|unused:0:i
struct HWINEVENTHOOK__|4|4|s|7|unused:0:i
struct HWINSTA__|4|4|s|7|unused:0:i
struct HWND__|4|4|s|7|unused:0:i
struct IShellFolderViewCBVtbl|8|1|s|d|MessageSFVCB:0:p
struct SC_HANDLE__|4|4|s|7|unused:0:i
struct SERVICE_STATUS_HANDLE__|4|4|s|7|unused:0:i
struct WSAData|408|8|s|e|wVersion:0:t,wHighVersion:2:t,iMaxSockets:4:t,iMaxUdpDg:6:t,lpVendorInfo:8:*c,szDescription:16:[257]c,szSystemStatus:273:[129]c
struct _ACL|8|2|s|7|AclRevision:0:h,Sbz1:1:h,AclSize:2:t,AceCount:4:t,Sbz2:6:t
struct _AFPROTOCOLS|8|4|s|4|iAddressFamily:0:i,iProtocol:4:i
struct _AppBarData|48|8|s|4|cbSize:0:m,hWnd:8:*@struct HWND__;,uCallbackMessage:16:u,uEdge:20:u,rc:24:@struct tagRECT;,lParam:40:q
struct _BLENDFUNCTION|4|1|s|f|BlendOp:0:h,BlendFlags:1:h,SourceConstantAlpha:2:h,AlphaFormat:3:h
struct _BLOB|16|8|s|4|cbSize:0:m,pBlobData:8:*h
struct _BY_HANDLE_FILE_INFORMATION|52|4|s|3|dwFileAttributes:0:m,ftCreationTime:4:@struct _FILETIME;,ftLastAccessTime:12:@struct _FILETIME;,ftLastWriteTime:20:@struct _FILETIME;,dwVolumeSerialNumber:28:m,nFileSizeHigh:32:m,nFileSizeLow:36:m,nNumberOfLinks:40:m,nFileIndexHigh:44:m,nFileIndexLow:48:m
struct _CACHE_DESCRIPTOR|12|4|s|7|Level:0:h,Associativity:1:h,LineSize:2:t,Size:4:m,Type:8:i
struct _CACHE_RELATIONSHIP|48|8|s|7|Level:0:h,Associativity:1:h,LineSize:2:t,CacheSize:4:m,Type:8:i,Reserved:12:[18]h,GroupCount:30:t,GroupMask:32:@struct _GROUP_AFFINITY;,GroupMasks:32:[1]@struct _GROUP_AFFINITY;
struct _CLAIM_SECURITY_ATTRIBUTES_INFORMATION|16|8|s|7|Version:0:t,Reserved:2:t,AttributeCount:4:m,Attribute:8:@struct _CLAIM_SECURITY_ATTRIBUTES_INFORMATION.Attribute;
struct _CLAIM_SECURITY_ATTRIBUTES_INFORMATION.Attribute|0|0|u|7|pAttributeV1:0:*@struct _CLAIM_SECURITY_ATTRIBUTE_V1;
struct _CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE|16|8|s|7|Version:0:r,Name:8:*w
struct _CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE|16|8|s|7|pValue:0:*v,ValueLength:8:m
struct _CLAIM_SECURITY_ATTRIBUTE_V1|32|8|s|7|Name:0:*w,ValueType:8:t,Reserved:10:t,Flags:12:m,ValueCount:16:m,Values:24:@struct _CLAIM_SECURITY_ATTRIBUTE_V1.Values;
struct _CLAIM_SECURITY_ATTRIBUTE_V1.Values|0|0|u|7|pInt64:0:*q,pUint64:0:*r,ppString:0:**w,pFqbn:0:*@struct _CLAIM_SECURITY_ATTRIBUTE_FQBN_VALUE;,pOctetString:0:*@struct _CLAIM_SECURITY_ATTRIBUTE_OCTET_STRING_VALUE;
struct _COMMCONFIG|52|4|s|2|dwSize:0:m,wVersion:4:t,wReserved:6:t,dcb:8:@struct _DCB;,dwProviderSubType:36:m,dwProviderOffset:40:m,dwProviderSize:44:m,wcProviderData:48:[1]w
struct _COMMPROP|64|4|s|2|wPacketLength:0:t,wPacketVersion:2:t,dwServiceMask:4:m,dwReserved1:8:m,dwMaxTxQueue:12:m,dwMaxRxQueue:16:m,dwMaxBaud:20:m,dwProvSubType:24:m,dwProvCapabilities:28:m,dwSettableParams:32:m,dwSettableBaud:36:m,wSettableData:40:t,wSettableStopParity:42:t,dwCurrentTxQueue:44:m,dwCurrentRxQueue:48:m,dwProvSpec1:52:m,dwProvSpec2:56:m,wcProvChar:60:[1]w
struct _COMMTIMEOUTS|20|4|s|2|ReadIntervalTimeout:0:m,ReadTotalTimeoutMultiplier:4:m,ReadTotalTimeoutConstant:8:m,WriteTotalTimeoutMultiplier:12:m,WriteTotalTimeoutConstant:16:m
struct _COMSTAT|12|4|s|2|cbInQue:4:m,cbOutQue:8:m
struct _CONSOLE_CURSOR_INFO|8|4|s|g|dwSize:0:m,bVisible:4:i
struct _CONSOLE_FONT_INFO|8|4|s|h|nFont:0:m,dwFontSize:4:@struct _COORD;
struct _CONSOLE_FONT_INFOEX|84|4|s|i|cbSize:0:m,nFont:4:m,dwFontSize:8:@struct _COORD;,FontFamily:12:u,FontWeight:16:u,FaceName:20:[32]w
struct _CONSOLE_HISTORY_INFO|16|4|s|i|cbSize:0:u,HistoryBufferSize:4:u,NumberOfHistoryBuffers:8:u,dwFlags:12:m
struct _CONSOLE_READCONSOLE_CONTROL|16|4|s|j|nLength:0:m,nInitialChars:4:m,dwCtrlWakeupMask:8:m,dwControlKeyState:12:m
struct _CONSOLE_SCREEN_BUFFER_INFO|22|2|s|g|dwSize:0:@struct _COORD;,dwCursorPosition:4:@struct _COORD;,wAttributes:8:t,srWindow:10:@struct _SMALL_RECT;,dwMaximumWindowSize:18:@struct _COORD;
struct _CONSOLE_SCREEN_BUFFER_INFOEX|96|4|s|g|cbSize:0:m,dwSize:4:@struct _COORD;,dwCursorPosition:8:@struct _COORD;,wAttributes:12:t,srWindow:14:@struct _SMALL_RECT;,dwMaximumWindowSize:22:@struct _COORD;,wPopupAttributes:26:t,bFullscreenSupported:28:i,ColorTable:32:[16]m
struct _CONSOLE_SELECTION_INFO|16|4|s|i|dwFlags:0:m,dwSelectionAnchor:4:@struct _COORD;,srSelection:8:@struct _SMALL_RECT;
struct _CONTEXT|1232|16|s|7|P1Home:0:r,P2Home:8:r,P3Home:16:r,P4Home:24:r,P5Home:32:r,P6Home:40:r,ContextFlags:48:m,MxCsr:52:m,SegCs:56:t,SegDs:58:t,SegEs:60:t,SegFs:62:t,SegGs:64:t,SegSs:66:t,EFlags:68:m,Dr0:72:r,Dr1:80:r,Dr2:88:r,Dr3:96:r,Dr6:104:r,Dr7:112:r,Rax:120:r,Rcx:128:r,Rdx:136:r,Rbx:144:r,Rsp:152:r,Rbp:160:r,Rsi:168:r,Rdi:176:r,R8:184:r,R9:192:r,R10:200:r,R11:208:r,R12:216:r,R13:224:r,R14:232:r,R15:240:r,Rip:248:r,FltSave:256:@struct _XMM_SAVE_AREA32;,FloatSave:256:@struct _XMM_SAVE_AREA32;,Header:256:[2]@struct _M128A;,Legacy:288:[8]@struct _M128A;,Xmm0:416:@struct _M128A;,Xmm1:432:@struct _M128A;,Xmm2:448:@struct _M128A;,Xmm3:464:@struct _M128A;,Xmm4:480:@struct _M128A;,Xmm5:496:@struct _M128A;,Xmm6:512:@struct _M128A;,Xmm7:528:@struct _M128A;,Xmm8:544:@struct _M128A;,Xmm9:560:@struct _M128A;,Xmm10:576:@struct _M128A;,Xmm11:592:@struct _M128A;,Xmm12:608:@struct _M128A;,Xmm13:624:@struct _M128A;,Xmm14:640:@struct _M128A;,Xmm15:656:@struct _M128A;,VectorRegister:768:[26]@struct _M128A;,VectorControl:1184:r,DebugControl:1192:r,LastBranchToRip:1200:r,LastBranchFromRip:1208:r,LastExceptionToRip:1216:r,LastExceptionFromRip:1224:r
struct _COORD|4|2|s|h|X:0:s,Y:2:s
struct _CREATEFILE2_EXTENDED_PARAMETERS|32|8|s|3|dwSize:0:m,dwFileAttributes:4:m,dwFileFlags:8:m,dwSecurityQosFlags:12:m,lpSecurityAttributes:16:*@struct _SECURITY_ATTRIBUTES;,hTemplateFile:24:*v
struct _CREATE_PROCESS_DEBUG_INFO|72|8|s|4|hFile:0:*v,hProcess:8:*v,hThread:16:*v,lpBaseOfImage:24:*v,dwDebugInfoFileOffset:32:m,nDebugInfoSize:36:m,lpThreadLocalBase:40:*v,lpStartAddress:48:p,lpImageName:56:*v,fUnicode:64:t
struct _CREATE_THREAD_DEBUG_INFO|24|8|s|4|hThread:0:*v,lpThreadLocalBase:8:*v,lpStartAddress:16:p
struct _CSADDR_INFO|40|8|s|4|LocalAddr:0:@struct _SOCKET_ADDRESS;,RemoteAddr:16:@struct _SOCKET_ADDRESS;,iSocketType:32:i,iProtocol:36:i
struct _CSFV|56|8|s|1|cbSize:0:u,pshf:8:*@IShellFolder;,psvOuter:16:*@IShellView;,pidl:24:^@struct _ITEMIDLIST;,lEvents:32:l,pfnCallback:40:p,fvm:48:i
struct _DCB|28|4|s|2|DCBlength:0:m,BaudRate:4:m,wReserved:12:t,XonLim:14:t,XoffLim:16:t,ByteSize:18:h,Parity:19:h,StopBits:20:h,XonChar:21:c,XoffChar:22:c,ErrorChar:23:c,EofChar:24:c,EvtChar:25:c,wReserved1:26:t
struct _DEBUG_EVENT|176|8|s|4|dwDebugEventCode:0:m,dwProcessId:4:m,dwThreadId:8:m,u:16:@struct _DEBUG_EVENT.u;
struct _DEBUG_EVENT.u|0|0|u|4|Exception:0:@struct _EXCEPTION_DEBUG_INFO;,CreateThread:0:@struct _CREATE_THREAD_DEBUG_INFO;,CreateProcessInfo:0:@struct _CREATE_PROCESS_DEBUG_INFO;,ExitThread:0:@struct _EXIT_THREAD_DEBUG_INFO;,ExitProcess:0:@struct _EXIT_PROCESS_DEBUG_INFO;,LoadDll:0:@struct _LOAD_DLL_DEBUG_INFO;,UnloadDll:0:@struct _UNLOAD_DLL_DEBUG_INFO;,DebugString:0:@struct _OUTPUT_DEBUG_STRING_INFO;,RipInfo:0:@struct _RIP_INFO;
struct _DISPATCHER_CONTEXT|80|8|s|7|ControlPc:0:r,ImageBase:8:r,FunctionEntry:16:*@struct _RUNTIME_FUNCTION;,EstablisherFrame:24:r,TargetIp:32:r,ContextRecord:40:*@struct _CONTEXT;,LanguageHandler:48:*v,HandlerData:56:*v,HistoryTable:64:*@struct _UNWIND_HISTORY_TABLE;,ScopeIndex:72:m,Fill0:76:m
struct _DISPLAY_DEVICEA|424|4|s|4|cb:0:m,DeviceName:4:[32]c,DeviceString:36:[128]c,StateFlags:164:m,DeviceID:168:[128]c,DeviceKey:296:[128]c
struct _DISPLAY_DEVICEW|840|4|s|4|cb:0:m,DeviceName:4:[32]w,DeviceString:68:[128]w,StateFlags:324:m,DeviceID:328:[128]w,DeviceKey:584:[128]w
struct _ENUM_SERVICE_STATUSA|48|8|s|7|lpServiceName:0:*c,lpDisplayName:8:*c,ServiceStatus:16:@struct _SERVICE_STATUS;
struct _ENUM_SERVICE_STATUSW|48|8|s|7|lpServiceName:0:*w,lpDisplayName:8:*w,ServiceStatus:16:@struct _SERVICE_STATUS;
struct _EXCEPTION_DEBUG_INFO|160|8|s|4|ExceptionRecord:0:@struct _EXCEPTION_RECORD;,dwFirstChance:152:m
struct _EXCEPTION_POINTERS|16|8|s|7|ExceptionRecord:0:*@struct _EXCEPTION_RECORD;,ContextRecord:8:*@struct _CONTEXT;
struct _EXCEPTION_RECORD|152|8|s|7|ExceptionCode:0:m,ExceptionFlags:4:m,ExceptionRecord:8:*@struct _EXCEPTION_RECORD;,ExceptionAddress:16:*v,NumberParameters:24:m,ExceptionInformation:32:[15]r
struct _EXIT_PROCESS_DEBUG_INFO|4|4|s|4|dwExitCode:0:m
struct _EXIT_THREAD_DEBUG_INFO|4|4|s|4|dwExitCode:0:m
struct _FILEMUIINFO|80|4|s|4|dwSize:0:m,dwVersion:4:m,dwFileType:8:m,pChecksum:12:[16]h,pServiceChecksum:28:[16]h,dwLanguageNameOffset:44:m,dwTypeIDMainSize:48:m,dwTypeIDMainOffset:52:m,dwTypeNameMainOffset:56:m,dwTypeIDMUISize:60:m,dwTypeIDMUIOffset:64:m,dwTypeNameMUIOffset:68:m,abBuffer:72:[8]h
struct _FILETIME|8|4|s|7|dwLowDateTime:0:m,dwHighDateTime:4:m
struct _FILE_ID_128|16|1|s|7|Identifier:0:[16]h
struct _FOCUS_EVENT_RECORD|4|4|s|h|bSetFocus:0:i
struct _GENERIC_MAPPING|16|4|s|7|GenericRead:0:m,GenericWrite:4:m,GenericExecute:8:m,GenericAll:12:m
struct _GROUP_AFFINITY|16|8|s|7|Mask:0:r,Group:8:t,Reserved:10:[3]t
struct _GROUP_RELATIONSHIP|72|8|s|7|MaximumGroupCount:0:t,ActiveGroupCount:2:t,Reserved:4:[20]h,GroupInfo:24:[1]@struct _PROCESSOR_GROUP_INFO;
struct _GUID|16|4|s|k|Data1:0:m,Data2:4:t,Data3:6:t,Data4:8:[8]h
struct _HARDWARE_COUNTER_DATA|16|8|s|4|Type:0:i,Reserved:4:m,Value:8:r
struct _HEAP_SUMMARY|40|8|s|l|cb:0:m,cbAllocated:8:r,cbCommitted:16:r,cbReserved:24:r,cbMaxReserve:32:r
struct _ICONINFO|32|8|s|5|fIcon:0:i,xHotspot:4:m,yHotspot:8:m,hbmMask:16:*@struct HBITMAP__;,hbmColor:24:*@struct HBITMAP__;
struct _ICONINFOEXA|560|8|s|5|cbSize:0:m,fIcon:4:i,xHotspot:8:m,yHotspot:12:m,hbmMask:16:*@struct HBITMAP__;,hbmColor:24:*@struct HBITMAP__;,wResID:32:t,szModName:34:[260]c,szResName:294:[260]c
struct _ICONINFOEXW|1080|8|s|5|cbSize:0:m,fIcon:4:i,xHotspot:8:m,yHotspot:12:m,hbmMask:16:*@struct HBITMAP__;,hbmColor:24:*@struct HBITMAP__;,wResID:32:t,szModName:34:[260]w,szResName:554:[260]w
struct _IMAGE_DATA_DIRECTORY|8|4|s|7|VirtualAddress:0:m,Size:4:m
struct _IMAGE_DOS_HEADER|64|2|s|7|e_magic:0:t,e_cblp:2:t,e_cp:4:t,e_crlc:6:t,e_cparhdr:8:t,e_minalloc:10:t,e_maxalloc:12:t,e_ss:14:t,e_sp:16:t,e_csum:18:t,e_ip:20:t,e_cs:22:t,e_lfarlc:24:t,e_ovno:26:t,e_res:28:[4]t,e_oemid:36:t,e_oeminfo:38:t,e_res2:40:[10]t,e_lfanew:60:l
struct _IMAGE_EXPORT_DIRECTORY|40|4|s|7|Characteristics:0:m,TimeDateStamp:4:m,MajorVersion:8:t,MinorVersion:10:t,Name:12:m,Base:16:m,NumberOfFunctions:20:m,NumberOfNames:24:m,AddressOfFunctions:28:m,AddressOfNames:32:m,AddressOfNameOrdinals:36:m
struct _IMAGE_FILE_HEADER|20|4|s|7|Machine:0:t,NumberOfSections:2:t,TimeDateStamp:4:m,PointerToSymbolTable:8:m,NumberOfSymbols:12:m,SizeOfOptionalHeader:16:t,Characteristics:18:t
struct _IMAGE_IMPORT_DESCRIPTOR|20|4|s|7|Characteristics:0:m,OriginalFirstThunk:0:m,TimeDateStamp:4:m,ForwarderChain:8:m,Name:12:m,FirstThunk:16:m
struct _IMAGE_NT_HEADERS64|264|4|s|7|Signature:0:m,FileHeader:4:@struct _IMAGE_FILE_HEADER;,OptionalHeader:24:@struct _IMAGE_OPTIONAL_HEADER64;
struct _IMAGE_OPTIONAL_HEADER64|240|4|s|7|Magic:0:t,MajorLinkerVersion:2:h,MinorLinkerVersion:3:h,SizeOfCode:4:m,SizeOfInitializedData:8:m,SizeOfUninitializedData:12:m,AddressOfEntryPoint:16:m,BaseOfCode:20:m,ImageBase:24:r,SectionAlignment:32:m,FileAlignment:36:m,MajorOperatingSystemVersion:40:t,MinorOperatingSystemVersion:42:t,MajorImageVersion:44:t,MinorImageVersion:46:t,MajorSubsystemVersion:48:t,MinorSubsystemVersion:50:t,Win32VersionValue:52:m,SizeOfImage:56:m,SizeOfHeaders:60:m,CheckSum:64:m,Subsystem:68:t,DllCharacteristics:70:t,SizeOfStackReserve:72:r,SizeOfStackCommit:80:r,SizeOfHeapReserve:88:r,SizeOfHeapCommit:96:r,LoaderFlags:104:m,NumberOfRvaAndSizes:108:m,DataDirectory:112:[16]@struct _IMAGE_DATA_DIRECTORY;
struct _IMAGE_SECTION_HEADER|40|4|s|7|Name:0:[8]h,Misc:8:@struct _IMAGE_SECTION_HEADER.Misc;,VirtualAddress:12:m,SizeOfRawData:16:m,PointerToRawData:20:m,PointerToRelocations:24:m,PointerToLinenumbers:28:m,NumberOfRelocations:32:t,NumberOfLinenumbers:34:t,Characteristics:36:m
struct _IMAGE_SECTION_HEADER.Misc|0|0|u|7|PhysicalAddress:0:m,VirtualSize:0:m
struct _INPUT_RECORD|20|4|s|h|EventType:0:t,Event:4:@struct _INPUT_RECORD.Event;
struct _INPUT_RECORD.Event|0|0|u|h|KeyEvent:0:@struct _KEY_EVENT_RECORD;,MouseEvent:0:@struct _MOUSE_EVENT_RECORD;,WindowBufferSizeEvent:0:@struct _WINDOW_BUFFER_SIZE_RECORD;,MenuEvent:0:@struct _MENU_EVENT_RECORD;,FocusEvent:0:@struct _FOCUS_EVENT_RECORD;
struct _IO_COUNTERS|48|8|s|7|ReadOperationCount:0:r,WriteOperationCount:8:r,OtherOperationCount:16:r,ReadTransferCount:24:r,WriteTransferCount:32:r,OtherTransferCount:40:r
struct _ITEMIDLIST|3|1|s|m|mkid:0:@struct _SHITEMID;
struct _JOB_SET_ARRAY|16|8|s|7|JobHandle:0:*v,MemberLevel:8:m,Flags:12:m
struct _KEY_EVENT_RECORD|16|4|s|h|bKeyDown:0:i,wRepeatCount:4:t,wVirtualKeyCode:6:t,wVirtualScanCode:8:t,uChar:10:@struct _KEY_EVENT_RECORD.uChar;,dwControlKeyState:12:m
struct _KEY_EVENT_RECORD.uChar|0|0|u|h|UnicodeChar:0:w,AsciiChar:0:c
struct _KNONVOLATILE_CONTEXT_POINTERS|256|8|s|7|FloatingContext:0:[16]*@struct _M128A;,IntegerContext:128:[16]*r
struct _LIST_ENTRY|16|8|s|7|Flink:0:*@struct _LIST_ENTRY;,Blink:8:*@struct _LIST_ENTRY;
struct _LOAD_DLL_DEBUG_INFO|40|8|s|4|hFile:0:*v,lpBaseOfDll:8:*v,dwDebugInfoFileOffset:16:m,nDebugInfoSize:20:m,lpImageName:24:*v,fUnicode:32:t
struct _LUID|8|4|s|7|LowPart:0:m,HighPart:4:l
struct _LUID_AND_ATTRIBUTES|12|4|s|7|Luid:0:@struct _LUID;,Attributes:8:m
struct _M128A|16|16|s|7|Low:0:r,High:8:q
struct _MEMORYSTATUS|56|8|s|2|dwLength:0:m,dwMemoryLoad:4:m,dwTotalPhys:8:r,dwAvailPhys:16:r,dwTotalPageFile:24:r,dwAvailPageFile:32:r,dwTotalVirtual:40:r,dwAvailVirtual:48:r
struct _MEMORYSTATUSEX|64|8|s|n|dwLength:0:m,dwMemoryLoad:4:m,ullTotalPhys:8:r,ullAvailPhys:16:r,ullTotalPageFile:24:r,ullAvailPageFile:32:r,ullTotalVirtual:40:r,ullAvailVirtual:48:r,ullAvailExtendedVirtual:56:r
struct _MEMORY_BASIC_INFORMATION|48|8|s|7|BaseAddress:0:*v,AllocationBase:8:*v,AllocationProtect:16:m,PartitionId:20:t,RegionSize:24:r,State:32:m,Protect:36:m,Type:40:m
struct _MENU_EVENT_RECORD|4|4|s|h|dwCommandId:0:u
struct _MODULEINFO|24|8|s|o|lpBaseOfDll:0:*v,SizeOfImage:8:m,EntryPoint:16:*v
struct _MOUSE_EVENT_RECORD|16|4|s|h|dwMousePosition:0:@struct _COORD;,dwButtonState:4:m,dwControlKeyState:8:m,dwEventFlags:12:m
struct _NOTIFYICONDATAA|528|8|s|0|cbSize:0:m,hWnd:8:*@struct HWND__;,uID:16:u,uFlags:20:u,uCallbackMessage:24:u,hIcon:32:*@struct HICON__;,szTip:40:[128]c,dwState:168:m,dwStateMask:172:m,szInfo:176:[256]c,uTimeout:432:u,uVersion:432:u,szInfoTitle:436:[64]c,dwInfoFlags:500:m,guidItem:504:@struct _GUID;,hBalloonIcon:520:*@struct HICON__;
struct _NOTIFYICONDATAW|976|8|s|0|cbSize:0:m,hWnd:8:*@struct HWND__;,uID:16:u,uFlags:20:u,uCallbackMessage:24:u,hIcon:32:*@struct HICON__;,szTip:40:[128]w,dwState:296:m,dwStateMask:300:m,szInfo:304:[256]w,uTimeout:816:u,uVersion:816:u,szInfoTitle:820:[64]w,dwInfoFlags:948:m,guidItem:952:@struct _GUID;,hBalloonIcon:968:*@struct HICON__;
struct _NOTIFYICONIDENTIFIER|40|8|s|4|cbSize:0:m,hWnd:8:*@struct HWND__;,uID:16:u,guidItem:20:@struct _GUID;
struct _NUMA_NODE_RELATIONSHIP|40|8|s|7|NodeNumber:0:m,Reserved:4:[18]h,GroupCount:22:t,GroupMask:24:@struct _GROUP_AFFINITY;,GroupMasks:24:[1]@struct _GROUP_AFFINITY;
struct _OBJECT_TYPE_LIST|16|8|s|7|Level:0:t,Sbz:2:t,ObjectType:8:*@struct _GUID;
struct _OFSTRUCT|136|2|s|2|cBytes:0:h,fFixedDisk:1:h,nErrCode:2:t,Reserved1:4:t,Reserved2:6:t,szPathName:8:[128]c
struct _OPERATION_END_PARAMETERS|12|4|s|2|Version:0:m,OperationId:4:m,Flags:8:m
struct _OPERATION_START_PARAMETERS|12|4|s|2|Version:0:m,OperationId:4:m,Flags:8:m
struct _OSVERSIONINFOA|148|4|s|7|dwOSVersionInfoSize:0:m,dwMajorVersion:4:m,dwMinorVersion:8:m,dwBuildNumber:12:m,dwPlatformId:16:m,szCSDVersion:20:[128]c
struct _OSVERSIONINFOEXA|156|4|s|4|dwOSVersionInfoSize:0:m,dwMajorVersion:4:m,dwMinorVersion:8:m,dwBuildNumber:12:m,dwPlatformId:16:m,szCSDVersion:20:[128]c,wServicePackMajor:148:t,wServicePackMinor:150:t,wSuiteMask:152:t,wProductType:154:h,wReserved:155:h
struct _OSVERSIONINFOEXW|284|4|s|4|dwOSVersionInfoSize:0:m,dwMajorVersion:4:m,dwMinorVersion:8:m,dwBuildNumber:12:m,dwPlatformId:16:m,szCSDVersion:20:[128]w,wServicePackMajor:276:t,wServicePackMinor:278:t,wSuiteMask:280:t,wProductType:282:h,wReserved:283:h
struct _OSVERSIONINFOW|276|4|s|7|dwOSVersionInfoSize:0:m,dwMajorVersion:4:m,dwMinorVersion:8:m,dwBuildNumber:12:m,dwPlatformId:16:m,szCSDVersion:20:[128]w
struct _OUTPUT_DEBUG_STRING_INFO|16|8|s|4|lpDebugStringData:0:*c,fUnicode:8:t,nDebugStringLength:10:t
struct _OVERLAPPED|32|8|s|p|Internal:0:r,InternalHigh:8:r,Offset:16:m,OffsetHigh:20:m,Pointer:16:*v,hEvent:24:*v
struct _OVERLAPPED_ENTRY|32|8|s|p|lpCompletionKey:0:r,lpOverlapped:8:*@struct _OVERLAPPED;,Internal:16:r,dwNumberOfBytesTransferred:24:m
struct _PEB|712|8|s|q|Reserved1:0:[2]h,BeingDebugged:2:h,Reserved2:3:[1]h,Reserved3:8:[2]*v,Ldr:24:*@struct _PEB_LDR_DATA;,ProcessParameters:32:*@struct _RTL_USER_PROCESS_PARAMETERS;,Reserved4:40:[3]*v,AtlThunkSListPtr:64:*v,Reserved5:72:*v,Reserved6:80:m,Reserved7:88:*v,Reserved8:96:m,AtlThunkSListPtr32:100:m,Reserved9:104:[45]*v,Reserved10:464:[96]h,PostProcessInitRoutine:560:p,Reserved11:568:[128]h,Reserved12:696:[1]*v,SessionId:704:m
struct _PEB_LDR_DATA|48|8|s|q|Reserved1:0:[8]h,Reserved2:8:[3]*v,InMemoryOrderModuleList:32:@struct _LIST_ENTRY;
struct _PERFORMANCE_DATA|288|8|s|4|Size:0:t,Version:2:h,HwCountersCount:3:h,ContextSwitchCount:4:m,WaitReasonBitMap:8:r,CycleTime:16:r,RetryCount:24:m,Reserved:28:m,HwCounters:32:[16]@struct _HARDWARE_COUNTER_DATA;
struct _PERFORMANCE_INFORMATION|104|8|s|o|cb:0:m,CommitTotal:8:r,CommitLimit:16:r,CommitPeak:24:r,PhysicalTotal:32:r,PhysicalAvailable:40:r,SystemCache:48:r,KernelTotal:56:r,KernelPaged:64:r,KernelNonpaged:72:r,PageSize:80:r,HandleCount:88:m,ProcessCount:92:m,ThreadCount:96:m
struct _POINTL|8|4|s|7|x:0:l,y:4:l
struct _PRIVILEGE_SET|20|4|s|7|PrivilegeCount:0:m,Control:4:m,Privilege:8:[1]@struct _LUID_AND_ATTRIBUTES;
struct _PROCESSOR_GROUP_INFO|48|8|s|7|MaximumProcessorCount:0:h,ActiveProcessorCount:1:h,Reserved:2:[38]h,ActiveProcessorMask:40:r
struct _PROCESSOR_NUMBER|4|2|s|7|Group:0:t,Number:2:h,Reserved:3:h
struct _PROCESSOR_RELATIONSHIP|40|8|s|7|Flags:0:h,EfficiencyClass:1:h,Reserved:2:[20]h,GroupCount:22:t,GroupMask:24:[1]@struct _GROUP_AFFINITY;
struct _PROCESS_DYNAMIC_EH_CONTINUATION_TARGET|16|8|s|7|TargetAddress:0:r,Flags:8:r
struct _PROCESS_DYNAMIC_ENFORCED_ADDRESS_RANGE|24|8|s|7|BaseAddress:0:r,Size:8:r,Flags:16:m
struct _PROCESS_HEAP_ENTRY|40|8|s|4|lpData:0:*v,cbData:8:m,cbOverhead:12:h,iRegionIndex:13:h,wFlags:14:t,Block:16:@struct _PROCESS_HEAP_ENTRY.Block;,Region:16:@struct _PROCESS_HEAP_ENTRY.Region;
struct _PROCESS_HEAP_ENTRY.Block|0|0|s|4|hMem:0:*v,dwReserved:8:[3]m
struct _PROCESS_HEAP_ENTRY.Region|0|0|s|4|dwCommittedSize:0:m,dwUnCommittedSize:4:m,lpFirstBlock:8:*v,lpLastBlock:16:*v
struct _PROCESS_INFORMATION|24|8|s|4|hProcess:0:*v,hThread:8:*v,dwProcessId:16:m,dwThreadId:20:m
struct _PROCESS_MEMORY_COUNTERS|72|8|s|o|cb:0:m,PageFaultCount:4:m,PeakWorkingSetSize:8:r,WorkingSetSize:16:r,QuotaPeakPagedPoolUsage:24:r,QuotaPagedPoolUsage:32:r,QuotaPeakNonPagedPoolUsage:40:r,QuotaNonPagedPoolUsage:48:r,PagefileUsage:56:r,PeakPagefileUsage:64:r
struct _PSAPI_WS_WATCH_INFORMATION|16|8|s|o|FaultingPc:0:*v,FaultingVa:8:*v
struct _PSAPI_WS_WATCH_INFORMATION_EX|32|8|s|o|BasicInfo:0:@struct _PSAPI_WS_WATCH_INFORMATION;,FaultingThreadId:16:r,Flags:24:r
struct _QUERY_SERVICE_CONFIGA|64|8|s|4|dwServiceType:0:m,dwStartType:4:m,dwErrorControl:8:m,lpBinaryPathName:16:*c,lpLoadOrderGroup:24:*c,dwTagId:32:m,lpDependencies:40:*c,lpServiceStartName:48:*c,lpDisplayName:56:*c
struct _QUERY_SERVICE_CONFIGW|64|8|s|4|dwServiceType:0:m,dwStartType:4:m,dwErrorControl:8:m,lpBinaryPathName:16:*w,lpLoadOrderGroup:24:*w,dwTagId:32:m,lpDependencies:40:*w,lpServiceStartName:48:*w,lpDisplayName:56:*w
struct _QUERY_SERVICE_LOCK_STATUSA|24|8|s|4|fIsLocked:0:m,lpLockOwner:8:*c,dwLockDuration:16:m
struct _QUERY_SERVICE_LOCK_STATUSW|24|8|s|4|fIsLocked:0:m,lpLockOwner:8:*w,dwLockDuration:16:m
struct _QUOTA_LIMITS|48|8|s|7|PagedPoolLimit:0:r,NonPagedPoolLimit:8:r,MinimumWorkingSetSize:16:r,MaximumWorkingSetSize:24:r,PagefileLimit:32:r,TimeLimit:40:@union _LARGE_INTEGER;
struct _QualityOfService|80|8|s|r|SendingFlowspec:0:@struct _flowspec;,ReceivingFlowspec:32:@struct _flowspec;,ProviderSpecific:64:@struct _WSABUF;
struct _REASON_CONTEXT|32|8|s|4|Version:0:m,Flags:4:m,Reason:8:@struct _REASON_CONTEXT.Reason;
struct _REASON_CONTEXT.Reason|0|0|u|4|Detailed:0:@struct _REASON_CONTEXT.Reason.Detailed;,SimpleReasonString:0:*w
struct _REASON_CONTEXT.Reason.Detailed|0|0|s|4|LocalizedReasonModule:0:*@struct HINSTANCE__;,LocalizedReasonId:8:m,ReasonStringCount:12:m,ReasonStrings:16:**w
struct _RIP_INFO|8|4|s|4|dwError:0:m,dwType:4:m
struct _RTL_BARRIER|32|8|s|7|Reserved1:0:m,Reserved2:4:m,Reserved3:8:[2]r,Reserved4:24:m,Reserved5:28:m
struct _RTL_CONDITION_VARIABLE|8|8|s|4|Ptr:0:*v
struct _RTL_CRITICAL_SECTION|40|8|s|4|DebugInfo:0:*@struct _RTL_CRITICAL_SECTION_DEBUG;,LockCount:8:l,RecursionCount:12:l,OwningThread:16:*v,LockSemaphore:24:*v,SpinCount:32:r
struct _RTL_CRITICAL_SECTION_DEBUG|48|8|s|4|Type:0:t,CreatorBackTraceIndex:2:t,CriticalSection:8:*@struct _RTL_CRITICAL_SECTION;,ProcessLocksList:16:@struct _LIST_ENTRY;,EntryCount:32:m,ContentionCount:36:m,Flags:40:m,CreatorBackTraceIndexHigh:44:t,SpareWORD:46:t
struct _RTL_RUN_ONCE|8|8|s|7|Ptr:0:*v
struct _RTL_SRWLOCK|8|8|s|4|Ptr:0:*v
struct _RTL_USER_PROCESS_PARAMETERS|128|8|s|q|Reserved1:0:[16]h,Reserved2:16:[10]*v,ImagePathName:96:@struct _UNICODE_STRING;,CommandLine:112:@struct _UNICODE_STRING;
struct _RUNTIME_FUNCTION|12|4|s|7|BeginAddress:0:m,EndAddress:4:m,UnwindData:8:m
struct _SCOPE_ID|4|4|s|s|Value:0:m
struct _SECURITY_ATTRIBUTES|24|8|s|p|nLength:0:m,lpSecurityDescriptor:8:*v,bInheritHandle:16:i
struct _SERVICE_NOTIFYA|80|8|s|4|dwVersion:0:m,pfnNotifyCallback:8:p,pContext:16:*v,dwNotificationStatus:24:m,ServiceStatus:28:@struct _SERVICE_STATUS_PROCESS;,dwNotificationTriggered:64:m,pszServiceNames:72:*c
struct _SERVICE_NOTIFYW|80|8|s|4|dwVersion:0:m,pfnNotifyCallback:8:p,pContext:16:*v,dwNotificationStatus:24:m,ServiceStatus:28:@struct _SERVICE_STATUS_PROCESS;,dwNotificationTriggered:64:m,pszServiceNames:72:*w
struct _SERVICE_STATUS|28|4|s|7|dwServiceType:0:m,dwCurrentState:4:m,dwControlsAccepted:8:m,dwWin32ExitCode:12:m,dwServiceSpecificExitCode:16:m,dwCheckPoint:20:m,dwWaitHint:24:m
struct _SERVICE_STATUS_PROCESS|36|4|s|7|dwServiceType:0:m,dwCurrentState:4:m,dwControlsAccepted:8:m,dwWin32ExitCode:12:m,dwServiceSpecificExitCode:16:m,dwCheckPoint:20:m,dwWaitHint:24:m,dwProcessId:28:m,dwServiceFlags:32:m
struct _SERVICE_TABLE_ENTRYA|16|8|s|4|lpServiceName:0:*c,lpServiceProc:8:p
struct _SERVICE_TABLE_ENTRYW|16|8|s|4|lpServiceName:0:*w,lpServiceProc:8:p
struct _SFV_CREATE|32|8|s|d|cbSize:0:u,pshf:8:*@IShellFolder;,psvOuter:16:*@IShellView;,psfvcb:24:*@IShellFolderViewCB;
struct _SHCREATEPROCESSINFOW|88|8|s|0|cbSize:0:m,fMask:4:m,hwnd:8:*@struct HWND__;,pszFile:16:^w,pszParameters:24:^w,pszCurrentDirectory:32:^w,hUserToken:40:*v,lpProcessAttributes:48:*@struct _SECURITY_ATTRIBUTES;,lpThreadAttributes:56:*@struct _SECURITY_ATTRIBUTES;,bInheritHandles:64:i,dwCreationFlags:68:m,lpStartupInfo:72:*@struct _STARTUPINFOW;,lpProcessInformation:80:*@struct _PROCESS_INFORMATION;
struct _SHChangeNotifyEntry|12|1|s|d|pidl:0:^@struct _ITEMIDLIST;,fRecursive:8:i
struct _SHELLEXECUTEINFOA|112|8|s|4|cbSize:0:m,fMask:4:m,hwnd:8:*@struct HWND__;,lpVerb:16:^c,lpFile:24:^c,lpParameters:32:^c,lpDirectory:40:^c,nShow:48:i,hInstApp:56:*@struct HINSTANCE__;,lpIDList:64:*v,lpClass:72:^c,hkeyClass:80:*@struct HKEY__;,dwHotKey:88:m,hIcon:96:*v,hMonitor:96:*v,hProcess:104:*v
struct _SHELLEXECUTEINFOW|112|8|s|4|cbSize:0:m,fMask:4:m,hwnd:8:*@struct HWND__;,lpVerb:16:^w,lpFile:24:^w,lpParameters:32:^w,lpDirectory:40:^w,nShow:48:i,hInstApp:56:*@struct HINSTANCE__;,lpIDList:64:*v,lpClass:72:^w,hkeyClass:80:*@struct HKEY__;,dwHotKey:88:m,hIcon:96:*v,hMonitor:96:*v,hProcess:104:*v
struct _SHFILEINFOA|360|8|s|0|hIcon:0:*@struct HICON__;,iIcon:8:i,dwAttributes:12:m,szDisplayName:16:[260]c,szTypeName:276:[80]c
struct _SHFILEINFOW|696|8|s|0|hIcon:0:*@struct HICON__;,iIcon:8:i,dwAttributes:12:m,szDisplayName:16:[260]w,szTypeName:536:[80]w
struct _SHFILEOPSTRUCTA|56|8|s|0|hwnd:0:*@struct HWND__;,wFunc:8:u,pFrom:16:^c,pTo:24:^c,fFlags:32:t,fAnyOperationsAborted:36:i,hNameMappings:40:*v,lpszProgressTitle:48:^c
struct _SHFILEOPSTRUCTW|56|8|s|0|hwnd:0:*@struct HWND__;,wFunc:8:u,pFrom:16:^w,pTo:24:^w,fFlags:32:t,fAnyOperationsAborted:36:i,hNameMappings:40:*v,lpszProgressTitle:48:^w
struct _SHITEMID|3|1|s|m|cb:0:t,abID:2:[1]h
struct _SHQUERYRBINFO|24|8|s|0|cbSize:0:m,i64Size:8:q,i64NumItems:16:q
struct _SHSTOCKICONINFO|544|8|s|0|cbSize:0:m,hIcon:8:*@struct HICON__;,iSysImageIndex:16:i,iIcon:20:i,szPath:24:[260]w
struct _SID_AND_ATTRIBUTES|16|8|s|7|Sid:0:*v,Attributes:8:m
struct _SID_IDENTIFIER_AUTHORITY|6|1|s|7|Value:0:[6]h
struct _SLIST_ENTRY|16|16|s|7|Next:0:*@struct _SLIST_ENTRY;
struct _SMALL_RECT|8|2|s|h|Left:0:s,Top:2:s,Right:4:s,Bottom:6:s
struct _SOCKET_ADDRESS|16|8|s|4|lpSockaddr:0:*@struct sockaddr;,iSockaddrLength:8:i
struct _SOCKET_ADDRESS_LIST|24|8|s|4|iAddressCount:0:i,Address:8:[1]@struct _SOCKET_ADDRESS;
struct _STARTUPINFOA|104|8|s|t|cb:0:m,lpReserved:8:*c,lpDesktop:16:*c,lpTitle:24:*c,dwX:32:m,dwY:36:m,dwXSize:40:m,dwYSize:44:m,dwXCountChars:48:m,dwYCountChars:52:m,dwFillAttribute:56:m,dwFlags:60:m,wShowWindow:64:t,cbReserved2:66:t,lpReserved2:72:*h,hStdInput:80:*v,hStdOutput:88:*v,hStdError:96:*v
struct _STARTUPINFOW|104|8|s|t|cb:0:m,lpReserved:8:*w,lpDesktop:16:*w,lpTitle:24:*w,dwX:32:m,dwY:36:m,dwXSize:40:m,dwYSize:44:m,dwXCountChars:48:m,dwYCountChars:52:m,dwFillAttribute:56:m,dwFlags:60:m,wShowWindow:64:t,cbReserved2:66:t,lpReserved2:72:*h,hStdInput:80:*v,hStdOutput:88:*v,hStdError:96:*v
struct _SYSTEMTIME|16|2|s|p|wYear:0:t,wMonth:2:t,wDayOfWeek:4:t,wDay:6:t,wHour:8:t,wMinute:10:t,wSecond:12:t,wMilliseconds:14:t
struct _SYSTEM_CPU_SET_INFORMATION|32|8|s|7|Size:0:m,Type:4:i,CpuSet:8:@struct _SYSTEM_CPU_SET_INFORMATION.CpuSet;
struct _SYSTEM_CPU_SET_INFORMATION.CpuSet|0|0|s|7|Id:0:m,Group:4:t,LogicalProcessorIndex:6:h,CoreIndex:7:h,LastLevelCacheIndex:8:h,NumaNodeIndex:9:h,EfficiencyClass:10:h,AllFlags:11:h,Reserved:12:m,SchedulingClass:12:h,AllocationTag:16:r
struct _SYSTEM_INFO|48|8|s|n|dwOemId:0:m,wProcessorArchitecture:0:t,wReserved:2:t,dwPageSize:4:m,lpMinimumApplicationAddress:8:*v,lpMaximumApplicationAddress:16:*v,dwActiveProcessorMask:24:r,dwNumberOfProcessors:32:m,dwProcessorType:36:m,dwAllocationGranularity:40:m,wProcessorLevel:44:t,wProcessorRevision:46:t
struct _SYSTEM_LOGICAL_PROCESSOR_INFORMATION|32|8|s|7|ProcessorMask:0:r,Relationship:8:i,ProcessorCore:16:@struct _SYSTEM_LOGICAL_PROCESSOR_INFORMATION.ProcessorCore;,NumaNode:16:@struct _SYSTEM_LOGICAL_PROCESSOR_INFORMATION.NumaNode;,Cache:16:@struct _CACHE_DESCRIPTOR;,Reserved:16:[2]r
struct _SYSTEM_LOGICAL_PROCESSOR_INFORMATION.NumaNode|0|0|s|7|NodeNumber:0:m
struct _SYSTEM_LOGICAL_PROCESSOR_INFORMATION.ProcessorCore|0|0|s|7|Flags:0:h
struct _SYSTEM_LOGICAL_PROCESSOR_INFORMATION_EX|80|8|s|7|Relationship:0:i,Size:4:m,Processor:8:@struct _PROCESSOR_RELATIONSHIP;,NumaNode:8:@struct _NUMA_NODE_RELATIONSHIP;,Cache:8:@struct _CACHE_RELATIONSHIP;,Group:8:@struct _GROUP_RELATIONSHIP;
struct _SYSTEM_POWER_STATUS|12|4|s|2|ACLineStatus:0:h,BatteryFlag:1:h,BatteryLifePercent:2:h,SystemStatusFlag:3:h,BatteryLifeTime:4:m,BatteryFullLifeTime:8:m
struct _SYSTEM_PROCESSOR_CYCLE_TIME_INFORMATION|8|8|s|7|CycleTime:0:r
struct _TEB|6024|8|s|q|Reserved1:0:[12]*v,ProcessEnvironmentBlock:96:*@struct _PEB;,Reserved2:104:[399]*v,Reserved3:3296:[1952]h,TlsSlots:5248:[64]*v,Reserved4:5760:[8]h,Reserved5:5768:[26]*v,ReservedForOle:5976:*v,Reserved6:5984:[4]*v,TlsExpansionSlots:6016:*v
struct _TIME_DYNAMIC_ZONE_INFORMATION|432|4|s|u|Bias:0:l,StandardName:4:[32]w,StandardDate:68:@struct _SYSTEMTIME;,StandardBias:84:l,DaylightName:88:[32]w,DaylightDate:152:@struct _SYSTEMTIME;,DaylightBias:168:l,TimeZoneKeyName:172:[128]w,DynamicDaylightTimeDisabled:428:h
struct _TIME_ZONE_INFORMATION|172|4|s|u|Bias:0:l,StandardName:4:[32]w,StandardDate:68:@struct _SYSTEMTIME;,StandardBias:84:l,DaylightName:88:[32]w,DaylightDate:152:@struct _SYSTEMTIME;,DaylightBias:168:l
struct _TOKEN_GROUPS|24|8|s|7|GroupCount:0:m,Groups:8:[1]@struct _SID_AND_ATTRIBUTES;
struct _TOKEN_PRIVILEGES|16|4|s|7|PrivilegeCount:0:m,Privileges:4:[1]@struct _LUID_AND_ATTRIBUTES;
struct _TP_CALLBACK_ENVIRON_V3|72|8|s|4|Version:0:m,Pool:8:*@struct _TP_POOL;,CleanupGroup:16:*@struct _TP_CLEANUP_GROUP;,CleanupGroupCancelCallback:24:p,RaceDll:32:*v,ActivationContext:40:*@struct _ACTIVATION_CONTEXT;,FinalizationCallback:48:p,u:56:@struct _TP_CALLBACK_ENVIRON_V3.u;,CallbackPriority:60:i,Size:64:m
struct _TP_CALLBACK_ENVIRON_V3.u|0|0|u|4|Flags:0:m,s:0:@struct _TP_CALLBACK_ENVIRON_V3.u.s;
struct _TP_CALLBACK_ENVIRON_V3.u.s|0|0|s|4|
struct _TP_POOL_STACK_INFORMATION|16|8|s|4|StackReserve:0:r,StackCommit:8:r
struct _UMS_SCHEDULER_STARTUP_INFO|32|8|s|2|UmsVersion:0:m,CompletionList:8:*v,SchedulerProc:16:*v,SchedulerParam:24:*v
struct _UMS_SYSTEM_THREAD_INFORMATION|8|4|s|2|UmsVersion:0:m,ThreadUmsFlags:4:m
struct _UNICODE_STRING|16|8|s|q|Length:0:t,MaximumLength:2:t,Buffer:8:*w
struct _UNLOAD_DLL_DEBUG_INFO|8|8|s|4|lpBaseOfDll:0:*v
struct _UNWIND_HISTORY_TABLE|216|8|s|7|Count:0:m,LocalHint:4:h,GlobalHint:5:h,Search:6:h,Once:7:h,LowAddress:8:r,HighAddress:16:r,Entry:24:[12]@struct _UNWIND_HISTORY_TABLE_ENTRY;
struct _UNWIND_HISTORY_TABLE_ENTRY|16|8|s|7|ImageBase:0:r,FunctionEntry:8:*@struct _RUNTIME_FUNCTION;
struct _WIN32_FIND_DATAA|320|4|s|p|dwFileAttributes:0:m,ftCreationTime:4:@struct _FILETIME;,ftLastAccessTime:12:@struct _FILETIME;,ftLastWriteTime:20:@struct _FILETIME;,nFileSizeHigh:28:m,nFileSizeLow:32:m,dwReserved0:36:m,dwReserved1:40:m,cFileName:44:[260]c,cAlternateFileName:304:[14]c
struct _WIN32_FIND_DATAW|592|4|s|p|dwFileAttributes:0:m,ftCreationTime:4:@struct _FILETIME;,ftLastAccessTime:12:@struct _FILETIME;,ftLastWriteTime:20:@struct _FILETIME;,nFileSizeHigh:28:m,nFileSizeLow:32:m,dwReserved0:36:m,dwReserved1:40:m,cFileName:44:[260]w,cAlternateFileName:564:[14]w
struct _WIN32_MEMORY_RANGE_ENTRY|16|8|s|v|VirtualAddress:0:*v,NumberOfBytes:8:r
struct _WINDOW_BUFFER_SIZE_RECORD|4|2|s|h|dwSize:0:@struct _COORD;
struct _WOW64_CONTEXT|716|4|s|7|ContextFlags:0:m,Dr0:4:m,Dr1:8:m,Dr2:12:m,Dr3:16:m,Dr6:20:m,Dr7:24:m,FloatSave:28:@struct _WOW64_FLOATING_SAVE_AREA;,SegGs:140:m,SegFs:144:m,SegEs:148:m,SegDs:152:m,Edi:156:m,Esi:160:m,Ebx:164:m,Edx:168:m,Ecx:172:m,Eax:176:m,Ebp:180:m,Eip:184:m,SegCs:188:m,EFlags:192:m,Esp:196:m,SegSs:200:m,ExtendedRegisters:204:[512]h
struct _WOW64_FLOATING_SAVE_AREA|112|4|s|7|ControlWord:0:m,StatusWord:4:m,TagWord:8:m,ErrorOffset:12:m,ErrorSelector:16:m,DataOffset:20:m,DataSelector:24:m,RegisterArea:28:[80]h,Cr0NpxState:108:m
struct _WOW64_LDT_ENTRY|8|4|s|7|LimitLow:0:t,BaseLow:2:t,HighWord:4:@struct _WOW64_LDT_ENTRY.HighWord;
struct _WOW64_LDT_ENTRY.HighWord|0|0|u|7|Bytes:0:@struct _WOW64_LDT_ENTRY.HighWord.Bytes;,Bits:0:@struct _WOW64_LDT_ENTRY.HighWord.Bits;
struct _WOW64_LDT_ENTRY.HighWord.Bits|0|0|s|7|
struct _WOW64_LDT_ENTRY.HighWord.Bytes|0|0|s|7|BaseMid:0:h,Flags1:1:h,Flags2:2:h,BaseHi:3:h
struct _WSABUF|16|8|s|r|len:0:m,buf:8:*c
struct _WSACOMPLETION|32|8|s|4|Type:0:i,Parameters:8:@struct _WSACOMPLETION.Parameters;
struct _WSACOMPLETION.Parameters|0|0|u|4|WindowMessage:0:@struct _WSACOMPLETION.Parameters.WindowMessage;,Event:0:@struct _WSACOMPLETION.Parameters.Event;,Apc:0:@struct _WSACOMPLETION.Parameters.Apc;,Port:0:@struct _WSACOMPLETION.Parameters.Port;
struct _WSACOMPLETION.Parameters.Apc|0|0|s|4|lpOverlapped:0:*@struct _OVERLAPPED;,lpfnCompletionProc:8:p
struct _WSACOMPLETION.Parameters.Event|0|0|s|4|lpOverlapped:0:*@struct _OVERLAPPED;
struct _WSACOMPLETION.Parameters.Port|0|0|s|4|lpOverlapped:0:*@struct _OVERLAPPED;,hPort:8:*v,Key:16:r
struct _WSACOMPLETION.Parameters.WindowMessage|0|0|s|4|hWnd:0:*@struct HWND__;,uMsg:8:u,context:16:r
struct _WSAMSG|56|8|s|4|name:0:*@struct sockaddr;,namelen:8:i,lpBuffers:16:*@struct _WSABUF;,dwBufferCount:24:m,Control:32:@struct _WSABUF;,dwFlags:48:m
struct _WSANAMESPACE_INFOA|40|8|s|4|NSProviderId:0:@struct _GUID;,dwNameSpace:16:m,fActive:20:i,dwVersion:24:m,lpszIdentifier:32:*c
struct _WSANAMESPACE_INFOEXA|56|8|s|r|NSProviderId:0:@struct _GUID;,dwNameSpace:16:m,fActive:20:i,dwVersion:24:m,lpszIdentifier:32:*c,ProviderSpecific:40:@struct _BLOB;
struct _WSANAMESPACE_INFOEXW|56|8|s|r|NSProviderId:0:@struct _GUID;,dwNameSpace:16:m,fActive:20:i,dwVersion:24:m,lpszIdentifier:32:*w,ProviderSpecific:40:@struct _BLOB;
struct _WSANAMESPACE_INFOW|40|8|s|4|NSProviderId:0:@struct _GUID;,dwNameSpace:16:m,fActive:20:i,dwVersion:24:m,lpszIdentifier:32:*w
struct _WSANETWORKEVENTS|44|4|s|r|lNetworkEvents:0:l,iErrorCode:4:[10]i
struct _WSANSClassInfoA|32|8|s|4|lpszName:0:*c,dwNameSpace:8:m,dwValueType:12:m,dwValueSize:16:m,lpValue:24:*v
struct _WSANSClassInfoW|32|8|s|4|lpszName:0:*w,dwNameSpace:8:m,dwValueType:12:m,dwValueSize:16:m,lpValue:24:*v
struct _WSAPROTOCOLCHAIN|32|4|s|r|ChainLen:0:i,ChainEntries:4:[7]m
struct _WSAPROTOCOL_INFOA|372|4|s|r|dwServiceFlags1:0:m,dwServiceFlags2:4:m,dwServiceFlags3:8:m,dwServiceFlags4:12:m,dwProviderFlags:16:m,ProviderId:20:@struct _GUID;,dwCatalogEntryId:36:m,ProtocolChain:40:@struct _WSAPROTOCOLCHAIN;,iVersion:72:i,iAddressFamily:76:i,iMaxSockAddr:80:i,iMinSockAddr:84:i,iSocketType:88:i,iProtocol:92:i,iProtocolMaxOffset:96:i,iNetworkByteOrder:100:i,iSecurityScheme:104:i,dwMessageSize:108:m,dwProviderReserved:112:m,szProtocol:116:[256]c
struct _WSAPROTOCOL_INFOW|628|4|s|r|dwServiceFlags1:0:m,dwServiceFlags2:4:m,dwServiceFlags3:8:m,dwServiceFlags4:12:m,dwProviderFlags:16:m,ProviderId:20:@struct _GUID;,dwCatalogEntryId:36:m,ProtocolChain:40:@struct _WSAPROTOCOLCHAIN;,iVersion:72:i,iAddressFamily:76:i,iMaxSockAddr:80:i,iMinSockAddr:84:i,iSocketType:88:i,iProtocol:92:i,iProtocolMaxOffset:96:i,iNetworkByteOrder:100:i,iSecurityScheme:104:i,dwMessageSize:108:m,dwProviderReserved:112:m,szProtocol:116:[256]w
struct _WSAQuerySetA|120|8|s|4|dwSize:0:m,lpszServiceInstanceName:8:*c,lpServiceClassId:16:*@struct _GUID;,lpVersion:24:*@struct _WSAVersion;,lpszComment:32:*c,dwNameSpace:40:m,lpNSProviderId:48:*@struct _GUID;,lpszContext:56:*c,dwNumberOfProtocols:64:m,lpafpProtocols:72:*@struct _AFPROTOCOLS;,lpszQueryString:80:*c,dwNumberOfCsAddrs:88:m,lpcsaBuffer:96:*@struct _CSADDR_INFO;,dwOutputFlags:104:m,lpBlob:112:*@struct _BLOB;
struct _WSAQuerySetW|120|8|s|4|dwSize:0:m,lpszServiceInstanceName:8:*w,lpServiceClassId:16:*@struct _GUID;,lpVersion:24:*@struct _WSAVersion;,lpszComment:32:*w,dwNameSpace:40:m,lpNSProviderId:48:*@struct _GUID;,lpszContext:56:*w,dwNumberOfProtocols:64:m,lpafpProtocols:72:*@struct _AFPROTOCOLS;,lpszQueryString:80:*w,dwNumberOfCsAddrs:88:m,lpcsaBuffer:96:*@struct _CSADDR_INFO;,dwOutputFlags:104:m,lpBlob:112:*@struct _BLOB;
struct _WSAServiceClassInfoA|32|8|s|4|lpServiceClassId:0:*@struct _GUID;,lpszServiceClassName:8:*c,dwCount:16:m,lpClassInfos:24:*@struct _WSANSClassInfoA;
struct _WSAServiceClassInfoW|32|8|s|4|lpServiceClassId:0:*@struct _GUID;,lpszServiceClassName:8:*w,dwCount:16:m,lpClassInfos:24:*@struct _WSANSClassInfoW;
struct _WSAVersion|8|4|s|4|dwVersion:0:m,ecHow:4:i
struct _XMM_SAVE_AREA32|512|16|s|7|ControlWord:0:t,StatusWord:2:t,TagWord:4:h,Reserved1:5:h,ErrorOpcode:6:t,ErrorOffset:8:m,ErrorSelector:12:t,Reserved2:14:t,DataOffset:16:m,DataSelector:20:t,Reserved3:22:t,MxCsr:24:m,MxCsr_Mask:28:m,FloatRegisters:32:[8]@struct _M128A;,XmmRegisters:160:[16]@struct _M128A;,Reserved4:416:[96]h
struct __finddata64_t|304|8|s|w|attrib:0:u,time_create:8:q,time_access:16:q,time_write:24:q,size:32:q,name:40:[260]c
struct __timeb32|12|4|s|x|time:0:l,millitm:4:t,timezone:6:s,dstflag:8:s
struct __timeb64|16|8|s|x|time:0:q,millitm:8:t,timezone:10:s,dstflag:12:s
struct _browseinfoA|64|8|s|1|hwndOwner:0:*@struct HWND__;,pidlRoot:8:^@struct _ITEMIDLIST;,pszDisplayName:16:*c,lpszTitle:24:^c,ulFlags:32:u,lpfn:40:p,lParam:48:q,iImage:56:i
struct _browseinfoW|64|8|s|1|hwndOwner:0:*@struct HWND__;,pidlRoot:8:^@struct _ITEMIDLIST;,pszDisplayName:16:*w,lpszTitle:24:^w,ulFlags:32:u,lpfn:40:p,lParam:48:q,iImage:56:i
struct _cpinfo|20|4|s|y|MaxCharSize:0:u,DefaultChar:4:[2]h,LeadByte:6:[12]h
struct _cpinfoexA|284|4|s|y|MaxCharSize:0:u,DefaultChar:4:[2]h,LeadByte:6:[12]h,UnicodeDefaultChar:18:w,CodePage:20:u,CodePageName:24:[260]c
struct _cpinfoexW|544|4|s|y|MaxCharSize:0:u,DefaultChar:4:[2]h,LeadByte:6:[12]h,UnicodeDefaultChar:18:w,CodePage:20:u,CodePageName:24:[260]w
struct _currencyfmtA|48|8|s|4|NumDigits:0:u,LeadingZero:4:u,Grouping:8:u,lpDecimalSep:16:*c,lpThousandSep:24:*c,NegativeOrder:32:u,PositiveOrder:36:u,lpCurrencySymbol:40:*c
struct _currencyfmtW|48|8|s|4|NumDigits:0:u,LeadingZero:4:u,Grouping:8:u,lpDecimalSep:16:*w,lpThousandSep:24:*w,NegativeOrder:32:u,PositiveOrder:36:u,lpCurrencySymbol:40:*w
struct _devicemodeA|156|4|s|4|dmDeviceName:0:[32]h,dmSpecVersion:32:t,dmDriverVersion:34:t,dmSize:36:t,dmDriverExtra:38:t,dmFields:40:m,dmOrientation:44:s,dmPaperSize:46:s,dmPaperLength:48:s,dmPaperWidth:50:s,dmScale:52:s,dmCopies:54:s,dmDefaultSource:56:s,dmPrintQuality:58:s,dmPosition:44:@struct _POINTL;,dmDisplayOrientation:52:m,dmDisplayFixedOutput:56:m,dmColor:60:s,dmDuplex:62:s,dmYResolution:64:s,dmTTOption:66:s,dmCollate:68:s,dmFormName:70:[32]h,dmLogPixels:102:t,dmBitsPerPel:104:m,dmPelsWidth:108:m,dmPelsHeight:112:m,dmDisplayFlags:116:m,dmNup:116:m,dmDisplayFrequency:120:m,dmICMMethod:124:m,dmICMIntent:128:m,dmMediaType:132:m,dmDitherType:136:m,dmReserved1:140:m,dmReserved2:144:m,dmPanningWidth:148:m,dmPanningHeight:152:m
struct _devicemodeW|220|4|s|4|dmDeviceName:0:[32]w,dmSpecVersion:64:t,dmDriverVersion:66:t,dmSize:68:t,dmDriverExtra:70:t,dmFields:72:m,dmOrientation:76:s,dmPaperSize:78:s,dmPaperLength:80:s,dmPaperWidth:82:s,dmScale:84:s,dmCopies:86:s,dmDefaultSource:88:s,dmPrintQuality:90:s,dmPosition:76:@struct _POINTL;,dmDisplayOrientation:84:m,dmDisplayFixedOutput:88:m,dmColor:92:s,dmDuplex:94:s,dmYResolution:96:s,dmTTOption:98:s,dmCollate:100:s,dmFormName:102:[32]w,dmLogPixels:166:t,dmBitsPerPel:168:m,dmPelsWidth:172:m,dmPelsHeight:176:m,dmDisplayFlags:180:m,dmNup:180:m,dmDisplayFrequency:184:m,dmICMMethod:188:m,dmICMIntent:192:m,dmMediaType:196:m,dmDitherType:200:m,dmReserved1:204:m,dmReserved2:208:m,dmPanningWidth:212:m,dmPanningHeight:216:m
struct _diskfree_t|16|4|s|z|total_clusters:0:u,avail_clusters:4:u,sectors_per_cluster:8:u,bytes_per_sector:12:u
struct _finddata32_t|280|4|s|w|attrib:0:u,time_create:4:l,time_access:8:l,time_write:12:l,size:16:m,name:20:[260]c
struct _finddata32i64_t|288|8|s|w|attrib:0:u,time_create:4:l,time_access:8:l,time_write:12:l,size:16:q,name:24:[260]c
struct _finddata64i32_t|296|8|s|w|attrib:0:u,time_create:8:q,time_access:16:q,time_write:24:q,size:32:m,name:36:[260]c
struct _flowspec|32|4|s|10|TokenRate:0:m,TokenBucketSize:4:m,PeakBandwidth:8:m,Latency:12:m,DelayVariation:16:m,ServiceType:20:m,MaxSduSize:24:m,MinimumPolicedSize:28:m
struct _heapinfo|24|8|s|11|_pentry:0:*i,_size:8:z,_useflag:16:i
struct _iobuf|8|8|s|12|_Placeholder:0:*v
struct _nlsversioninfo|32|4|s|4|dwNLSVersionInfoSize:0:m,dwNLSVersion:4:m,dwDefinedVersion:8:m,dwEffectiveId:12:m,guidCustomVersion:16:@struct _GUID;
struct _nlsversioninfoex|32|4|s|4|dwNLSVersionInfoSize:0:m,dwNLSVersion:4:m,dwDefinedVersion:8:m,dwEffectiveId:12:m,guidCustomVersion:16:@struct _GUID;
struct _numberfmtA|40|8|s|4|NumDigits:0:u,LeadingZero:4:u,Grouping:8:u,lpDecimalSep:16:*c,lpThousandSep:24:*c,NegativeOrder:32:u
struct _numberfmtW|40|8|s|4|NumDigits:0:u,LeadingZero:4:u,Grouping:8:u,lpDecimalSep:16:*w,lpThousandSep:24:*w,NegativeOrder:32:u
struct _openasinfo|24|8|s|1|pcszFile:0:^w,pcszClass:8:^w,oaifInFlags:16:i
struct _stat32|36|4|s|13|st_dev:0:u,st_ino:4:t,st_mode:6:t,st_nlink:8:s,st_uid:10:s,st_gid:12:s,st_rdev:16:u,st_size:20:l,st_atime:24:l,st_mtime:28:l,st_ctime:32:l
struct _stat32i64|48|8|s|13|st_dev:0:u,st_ino:4:t,st_mode:6:t,st_nlink:8:s,st_uid:10:s,st_gid:12:s,st_rdev:16:u,st_size:24:q,st_atime:32:l,st_mtime:36:l,st_ctime:40:l
struct _stat64|56|8|s|13|st_dev:0:u,st_ino:4:t,st_mode:6:t,st_nlink:8:s,st_uid:10:s,st_gid:12:s,st_rdev:16:u,st_size:24:q,st_atime:32:q,st_mtime:40:q,st_ctime:48:q
struct _stat64i32|48|8|s|13|st_dev:0:u,st_ino:4:t,st_mode:6:t,st_nlink:8:s,st_uid:10:s,st_gid:12:s,st_rdev:16:u,st_size:20:l,st_atime:24:q,st_mtime:32:q,st_ctime:40:q
struct _tagpropertykey|20|4|s|14|fmtid:0:@struct _GUID;,pid:16:m
struct _timespec32|8|4|s|x|tv_sec:0:l,tv_nsec:4:l
struct _timespec64|16|8|s|x|tv_sec:0:q,tv_nsec:8:l
struct _wfinddata32_t|540|4|s|w|attrib:0:u,time_create:4:l,time_access:8:l,time_write:12:l,size:16:m,name:20:[260]w
struct _wfinddata32i64_t|544|8|s|w|attrib:0:u,time_create:4:l,time_access:8:l,time_write:12:l,size:16:q,name:24:[260]w
struct _wfinddata64_t|560|8|s|w|attrib:0:u,time_create:8:q,time_access:16:q,time_write:24:q,size:32:q,name:40:[260]w
struct _wfinddata64i32_t|560|8|s|w|attrib:0:u,time_create:8:q,time_access:16:q,time_write:24:q,size:32:m,name:36:[260]w
struct addrinfo|48|8|s|c|ai_flags:0:i,ai_family:4:i,ai_socktype:8:i,ai_protocol:12:i,ai_addrlen:16:z,ai_canonname:24:*c,ai_addr:32:*@struct sockaddr;,ai_next:40:*@struct addrinfo;
struct addrinfoW|48|8|s|c|ai_flags:0:i,ai_family:4:i,ai_socktype:8:i,ai_protocol:12:i,ai_addrlen:16:z,ai_canonname:24:*w,ai_addr:32:*@struct sockaddr;,ai_next:40:*@struct addrinfoW;
struct addrinfoexA|72|8|s|c|ai_flags:0:i,ai_family:4:i,ai_socktype:8:i,ai_protocol:12:i,ai_addrlen:16:z,ai_canonname:24:^c,ai_addr:32:*@struct sockaddr;,ai_blob:40:*v,ai_bloblen:48:z,ai_provider:56:*@struct _GUID;,ai_next:64:*@struct addrinfoexA;
struct addrinfoexW|72|8|s|c|ai_flags:0:i,ai_family:4:i,ai_socktype:8:i,ai_protocol:12:i,ai_addrlen:16:z,ai_canonname:24:^w,ai_addr:32:*@struct sockaddr;,ai_blob:40:*v,ai_bloblen:48:z,ai_provider:56:*@struct _GUID;,ai_next:64:*@struct addrinfoexW;
struct hostent|32|8|s|15|h_name:0:*c,h_aliases:8:**c,h_addrtype:16:s,h_length:18:s,h_addr_list:24:**c
struct in6_addr|16|2|s|16|u:0:@struct in6_addr.u;
struct in6_addr.u|0|0|u|16|Byte:0:[16]h,Word:0:[8]t
struct in_addr|4|4|s|17|S_un:0:@struct in_addr.S_un;
struct in_addr.S_un|0|0|u|17|S_un_b:0:@struct in_addr.S_un.S_un_b;,S_un_w:0:@struct in_addr.S_un.S_un_w;,S_addr:0:m
struct in_addr.S_un.S_un_b|0|0|s|17|s_b1:0:h,s_b2:1:h,s_b3:2:h,s_b4:3:h
struct in_addr.S_un.S_un_w|0|0|s|17|s_w1:0:t,s_w2:2:t
struct lconv|152|8|s|18|decimal_point:0:*c,thousands_sep:8:*c,grouping:16:*c,int_curr_symbol:24:*c,currency_symbol:32:*c,mon_decimal_point:40:*c,mon_thousands_sep:48:*c,mon_grouping:56:*c,positive_sign:64:*c,negative_sign:72:*c,int_frac_digits:80:c,frac_digits:81:c,p_cs_precedes:82:c,p_sep_by_space:83:c,n_cs_precedes:84:c,n_sep_by_space:85:c,p_sign_posn:86:c,n_sign_posn:87:c,_W_decimal_point:88:*w,_W_thousands_sep:96:*w,_W_int_curr_symbol:104:*w,_W_currency_symbol:112:*w,_W_mon_decimal_point:120:*w,_W_mon_thousands_sep:128:*w,_W_positive_sign:136:*w,_W_negative_sign:144:*w
struct localeinfo_struct|16|8|s|19|locinfo:0:*@struct threadlocaleinfostruct;,mbcinfo:8:*@struct threadmbcinfostruct;
struct pollfd|16|8|s|4|fd:0:r,events:8:s,revents:10:s
struct protoent|24|8|s|15|p_name:0:*c,p_aliases:8:**c,p_proto:16:s
struct servent|32|8|s|15|s_name:0:*c,s_aliases:8:**c,s_proto:16:*c,s_port:24:s
struct sockaddr|16|2|s|15|sa_family:0:t,sa_data:2:[14]c
struct sockaddr_in|16|4|s|15|sin_family:0:s,sin_port:2:t,sin_addr:4:@struct in_addr;,sin_zero:8:[8]c
struct sockaddr_in6|28|4|s|1a|sin6_family:0:s,sin6_port:2:t,sin6_flowinfo:4:m,sin6_addr:8:@struct in6_addr;,sin6_scope_id:24:m,sin6_scope_struct:24:@struct _SCOPE_ID;
struct sockaddr_storage|128|8|s|r|ss_family:0:s,__ss_pad1:2:[6]c,__ss_align:8:q,__ss_pad2:16:[112]c
struct stat|48|8|s|1b|st_dev:0:u,st_ino:4:t,st_mode:6:t,st_nlink:8:s,st_uid:10:s,st_gid:12:s,st_rdev:16:u,st_size:20:l,st_atime:24:q,st_mtime:32:q,st_ctime:40:q
struct stat64|56|8|s|1b|st_dev:0:u,st_ino:4:t,st_mode:6:t,st_nlink:8:s,st_uid:10:s,st_gid:12:s,st_rdev:16:u,st_size:24:q,st_atime:32:q,st_mtime:40:q,st_ctime:48:q
struct tagACCEL|6|2|s|5|fVirt:0:h,key:2:t,cmd:4:t
struct tagACTCTXA|56|8|s|2|cbSize:0:m,dwFlags:4:m,lpSource:8:^c,wProcessorArchitecture:16:t,wLangId:18:t,lpAssemblyDirectory:24:^c,lpResourceName:32:^c,lpApplicationName:40:^c,hModule:48:*@struct HINSTANCE__;
struct tagACTCTXW|56|8|s|2|cbSize:0:m,dwFlags:4:m,lpSource:8:^w,wProcessorArchitecture:16:t,wLangId:18:t,lpAssemblyDirectory:24:^w,lpResourceName:32:^w,lpApplicationName:40:^w,hModule:48:*@struct HINSTANCE__;
struct tagACTCTX_SECTION_KEYED_DATA|112|8|s|2|cbSize:0:m,ulDataFormatVersion:4:m,lpData:8:*v,ulLength:16:m,lpSectionGlobalData:24:*v,ulSectionGlobalDataLength:32:m,lpSectionBase:40:*v,ulSectionTotalLength:48:m,hActCtx:56:*v,ulAssemblyRosterIndex:64:m,ulFlags:68:m,AssemblyMetadata:72:@struct tagACTCTX_SECTION_KEYED_DATA_ASSEMBLY_METADATA;
struct tagACTCTX_SECTION_KEYED_DATA_ASSEMBLY_METADATA|40|8|s|2|lpInformation:0:*v,lpSectionBase:8:*v,ulSectionLength:16:m,lpSectionGlobalDataBase:24:*v,ulSectionGlobalDataLength:32:m
struct tagALTTABINFO|40|4|s|5|cbSize:0:m,cItems:4:i,cColumns:8:i,cRows:12:i,iColFocus:16:i,iRowFocus:20:i,cxItem:24:i,cyItem:28:i,ptStart:32:@struct tagPOINT;
struct tagBSTRBLOB|16|8|s|14|cbSize:0:m,pData:8:*h
struct tagCABOOL|16|8|s|6|cElems:0:m,pElems:8:*s
struct tagCABSTR|16|8|s|6|cElems:0:m,pElems:8:**w
struct tagCABSTRBLOB|16|8|s|6|cElems:0:m,pElems:8:*@struct tagBSTRBLOB;
struct tagCAC|16|8|s|6|cElems:0:m,pElems:8:*c
struct tagCACLIPDATA|16|8|s|6|cElems:0:m,pElems:8:*@struct tagCLIPDATA;
struct tagCACLSID|16|8|s|6|cElems:0:m,pElems:8:*@struct _GUID;
struct tagCACY|16|8|s|6|cElems:0:m,pElems:8:*@union tagCY;
struct tagCADATE|16|8|s|6|cElems:0:m,pElems:8:*d
struct tagCADBL|16|8|s|6|cElems:0:m,pElems:8:*d
struct tagCAFILETIME|16|8|s|6|cElems:0:m,pElems:8:*@struct _FILETIME;
struct tagCAFLT|16|8|s|6|cElems:0:m,pElems:8:*f
struct tagCAH|16|8|s|6|cElems:0:m,pElems:8:*@union _LARGE_INTEGER;
struct tagCAI|16|8|s|6|cElems:0:m,pElems:8:*s
struct tagCAL|16|8|s|6|cElems:0:m,pElems:8:*l
struct tagCALPSTR|16|8|s|6|cElems:0:m,pElems:8:**c
struct tagCALPWSTR|16|8|s|6|cElems:0:m,pElems:8:**w
struct tagCAPROPVARIANT|16|8|s|6|cElems:0:m,pElems:8:*@struct tagPROPVARIANT;
struct tagCASCODE|16|8|s|6|cElems:0:m,pElems:8:*l
struct tagCAUB|16|8|s|6|cElems:0:m,pElems:8:*h
struct tagCAUH|16|8|s|6|cElems:0:m,pElems:8:*@union _ULARGE_INTEGER;
struct tagCAUI|16|8|s|6|cElems:0:m,pElems:8:*t
struct tagCAUL|16|8|s|6|cElems:0:m,pElems:8:*m
struct tagCHANGEFILTERSTRUCT|8|4|s|5|cbSize:0:m,ExtStatus:4:m
struct tagCLIPDATA|16|8|s|14|cbSize:0:m,ulClipFmt:4:l,pClipData:8:*h
struct tagCOMBOBOXINFO|64|8|s|5|cbSize:0:m,rcItem:4:@struct tagRECT;,rcButton:20:@struct tagRECT;,stateButton:36:m,hwndCombo:40:*@struct HWND__;,hwndItem:48:*@struct HWND__;,hwndList:56:*@struct HWND__;
struct tagCURSORINFO|24|8|s|5|cbSize:0:m,flags:4:m,hCursor:8:*@struct HICON__;,ptScreenPos:16:@struct tagPOINT;
struct tagDEC|16|8|s|14|wReserved:0:t,scale:2:h,sign:3:h,signscale:2:t,Hi32:4:m,Lo32:8:m,Mid32:12:m,Lo64:8:r
struct tagDRAWTEXTPARAMS|20|4|s|5|cbSize:0:u,iTabLength:4:i,iLeftMargin:8:i,iRightMargin:12:i,uiLengthDrawn:16:u
struct tagDVTARGETDEVICE|16|4|s|6|tdSize:0:m,tdDriverNameOffset:4:t,tdDeviceNameOffset:6:t,tdPortNameOffset:8:t,tdExtDevmodeOffset:10:t,tdData:12:[1]h
struct tagFORMATETC|32|8|s|6|cfFormat:0:t,ptd:8:*@struct tagDVTARGETDEVICE;,dwAspect:16:m,lindex:20:l,tymed:24:m
struct tagGESTURECONFIG|12|4|s|5|dwID:0:m,dwWant:4:m,dwBlock:8:m
struct tagGESTUREINFO|56|8|s|5|cbSize:0:u,dwFlags:4:m,dwID:8:m,hwndTarget:16:*@struct HWND__;,ptsLocation:24:@struct tagPOINTS;,dwInstanceID:28:m,dwSequenceID:32:m,ullArguments:40:r,cbExtraArgs:48:u
struct tagGUITHREADINFO|72|8|s|5|cbSize:0:m,flags:4:m,hwndActive:8:*@struct HWND__;,hwndFocus:16:*@struct HWND__;,hwndCapture:24:*@struct HWND__;,hwndMenuOwner:32:*@struct HWND__;,hwndMoveSize:40:*@struct HWND__;,hwndCaret:48:*@struct HWND__;,rcCaret:56:@struct tagRECT;
struct tagHARDWAREINPUT|8|4|s|5|uMsg:0:m,wParamL:4:t,wParamH:6:t
struct tagHEAPENTRY32|56|8|s|1c|dwSize:0:r,hHandle:8:*v,dwAddress:16:r,dwBlockSize:24:r,dwFlags:32:m,dwLockCount:36:m,dwResvd:40:m,th32ProcessID:44:m,th32HeapID:48:r
struct tagHEAPLIST32|32|8|s|1c|dwSize:0:r,th32ProcessID:8:m,th32HeapID:16:r,dwFlags:24:m
struct tagHW_PROFILE_INFOA|124|4|s|2|dwDockInfo:0:m,szHwProfileGuid:4:[39]c,szHwProfileName:43:[80]c
struct tagHW_PROFILE_INFOW|244|4|s|2|dwDockInfo:0:m,szHwProfileGuid:4:[39]w,szHwProfileName:82:[80]w
struct tagINPUT|40|8|s|5|type:0:m,mi:8:@struct tagMOUSEINPUT;,ki:8:@struct tagKEYBDINPUT;,hi:8:@struct tagHARDWAREINPUT;
struct tagINPUT_MESSAGE_SOURCE|8|4|s|5|deviceType:0:i,originId:4:i
struct tagINPUT_TRANSFORM|64|4|s|5|_11:0:f,_12:4:f,_13:8:f,_14:12:f,_21:16:f,_22:20:f,_23:24:f,_24:28:f,_31:32:f,_32:36:f,_33:40:f,_34:44:f,_41:48:f,_42:52:f,_43:56:f,_44:60:f,m:0:[4][4]f
struct tagKEYBDINPUT|24|8|s|5|wVk:0:t,wScan:2:t,dwFlags:4:m,time:8:m,dwExtraInfo:16:r
struct tagLASTINPUTINFO|8|4|s|5|cbSize:0:u,dwTime:4:m
struct tagMENUBARINFO|48|8|s|5|cbSize:0:m,rcBar:4:@struct tagRECT;,hMenu:24:*@struct HMENU__;,hwndMenu:32:*@struct HWND__;
struct tagMENUINFO|40|8|s|5|cbSize:0:m,fMask:4:m,dwStyle:8:m,cyMax:12:u,hbrBack:16:*@struct HBRUSH__;,dwContextHelpID:24:m,dwMenuData:32:r
struct tagMENUITEMINFOA|80|8|s|5|cbSize:0:u,fMask:4:u,fType:8:u,fState:12:u,wID:16:u,hSubMenu:24:*@struct HMENU__;,hbmpChecked:32:*@struct HBITMAP__;,hbmpUnchecked:40:*@struct HBITMAP__;,dwItemData:48:r,dwTypeData:56:*c,cch:64:u,hbmpItem:72:*@struct HBITMAP__;
struct tagMENUITEMINFOW|80|8|s|5|cbSize:0:u,fMask:4:u,fType:8:u,fState:12:u,wID:16:u,hSubMenu:24:*@struct HMENU__;,hbmpChecked:32:*@struct HBITMAP__;,hbmpUnchecked:40:*@struct HBITMAP__;,dwItemData:48:r,dwTypeData:56:*w,cch:64:u,hbmpItem:72:*@struct HBITMAP__;
struct tagMODULEENTRY32|568|8|s|1c|dwSize:0:m,th32ModuleID:4:m,th32ProcessID:8:m,GlblcntUsage:12:m,ProccntUsage:16:m,modBaseAddr:24:*h,modBaseSize:32:m,hModule:40:*@struct HINSTANCE__;,szModule:48:[256]c,szExePath:304:[260]c
struct tagMODULEENTRY32W|1080|8|s|1c|dwSize:0:m,th32ModuleID:4:m,th32ProcessID:8:m,GlblcntUsage:12:m,ProccntUsage:16:m,modBaseAddr:24:*h,modBaseSize:32:m,hModule:40:*@struct HINSTANCE__;,szModule:48:[256]w,szExePath:560:[260]w
struct tagMONITORINFO|40|4|s|4|cbSize:0:m,rcMonitor:4:@struct tagRECT;,rcWork:20:@struct tagRECT;,dwFlags:36:m
struct tagMOUSEINPUT|32|8|s|5|dx:0:l,dy:4:l,mouseData:8:m,dwFlags:12:m,time:16:m,dwExtraInfo:24:r
struct tagMOUSEMOVEPOINT|24|8|s|5|x:0:i,y:4:i,time:8:m,dwExtraInfo:16:r
struct tagMSG|48|8|s|5|hwnd:0:*@struct HWND__;,message:8:u,wParam:16:r,lParam:24:q,time:32:m,pt:36:@struct tagPOINT;
struct tagMSGBOXPARAMSA|80|8|s|5|cbSize:0:u,hwndOwner:8:*@struct HWND__;,hInstance:16:*@struct HINSTANCE__;,lpszText:24:^c,lpszCaption:32:^c,dwStyle:40:m,lpszIcon:48:^c,dwContextHelpId:56:r,lpfnMsgBoxCallback:64:p,dwLanguageId:72:m
struct tagMSGBOXPARAMSW|80|8|s|5|cbSize:0:u,hwndOwner:8:*@struct HWND__;,hInstance:16:*@struct HINSTANCE__;,lpszText:24:^w,lpszCaption:32:^w,dwStyle:40:m,lpszIcon:48:^w,dwContextHelpId:56:r,lpfnMsgBoxCallback:64:p,dwLanguageId:72:m
struct tagPAINTSTRUCT|72|8|s|5|hdc:0:*@struct HDC__;,fErase:8:i,rcPaint:12:@struct tagRECT;,fRestore:28:i,fIncUpdate:32:i,rgbReserved:36:[32]h
struct tagPOINT|8|4|s|7|x:0:l,y:4:l
struct tagPOINTER_DEVICE_CURSOR_INFO|8|4|s|5|cursorId:0:u,cursor:4:i
struct tagPOINTER_DEVICE_INFO|1080|8|s|5|displayOrientation:0:m,device:8:*v,pointerDeviceType:16:i,monitor:24:*@struct HMONITOR__;,startingCursorId:32:m,maxActiveContacts:36:t,productString:38:[520]w
struct tagPOINTER_DEVICE_PROPERTY|28|4|s|5|logicalMin:0:i,logicalMax:4:i,physicalMin:8:i,physicalMax:12:i,unit:16:u,unitExponent:20:u,usagePageId:24:t,usageId:26:t
struct tagPOINTER_INFO|96|8|s|5|pointerType:0:m,pointerId:4:u,frameId:8:u,pointerFlags:12:u,sourceDevice:16:*v,hwndTarget:24:*@struct HWND__;,ptPixelLocation:32:@struct tagPOINT;,ptHimetricLocation:40:@struct tagPOINT;,ptPixelLocationRaw:48:@struct tagPOINT;,ptHimetricLocationRaw:56:@struct tagPOINT;,dwTime:64:m,historyCount:68:u,InputData:72:i,dwKeyStates:76:m,PerformanceCount:80:r,ButtonChangeType:88:i
struct tagPOINTER_PEN_INFO|120|8|s|5|pointerInfo:0:@struct tagPOINTER_INFO;,penFlags:96:u,penMask:100:u,pressure:104:u,rotation:108:u,tiltX:112:i,tiltY:116:i
struct tagPOINTER_TOUCH_INFO|144|8|s|5|pointerInfo:0:@struct tagPOINTER_INFO;,touchFlags:96:u,touchMask:100:u,rcContact:104:@struct tagRECT;,rcContactRaw:120:@struct tagRECT;,orientation:136:u,pressure:140:u
struct tagPOINTER_TYPE_INFO|152|8|s|5|type:0:m,touchInfo:8:@struct tagPOINTER_TOUCH_INFO;,penInfo:8:@struct tagPOINTER_PEN_INFO;
struct tagPOINTS|4|2|s|7|x:0:s,y:2:s
struct tagPROCESSENTRY32|304|8|s|1c|dwSize:0:m,cntUsage:4:m,th32ProcessID:8:m,th32DefaultHeapID:16:r,th32ModuleID:24:m,cntThreads:28:m,th32ParentProcessID:32:m,pcPriClassBase:36:l,dwFlags:40:m,szExeFile:44:[260]c
struct tagPROCESSENTRY32W|568|8|s|1c|dwSize:0:m,cntUsage:4:m,th32ProcessID:8:m,th32DefaultHeapID:16:r,th32ModuleID:24:m,cntThreads:28:m,th32ParentProcessID:32:m,pcPriClassBase:36:l,dwFlags:40:m,szExeFile:44:[260]w
struct tagPROPSPEC|16|8|s|6|ulKind:0:m,propid:8:m,lpwstr:8:*w
struct tagPROPVARIANT|24|8|s|6|vt:0:t,wReserved1:2:t,wReserved2:4:t,wReserved3:6:t,cVal:8:c,bVal:8:h,iVal:8:s,uiVal:8:t,lVal:8:l,ulVal:8:m,intVal:8:i,uintVal:8:u,hVal:8:@union _LARGE_INTEGER;,uhVal:8:@union _ULARGE_INTEGER;,fltVal:8:f,dblVal:8:d,boolVal:8:s,scode:8:l,cyVal:8:@union tagCY;,date:8:d,filetime:8:@struct _FILETIME;,puuid:8:*@struct _GUID;,pclipdata:8:*@struct tagCLIPDATA;,bstrVal:8:*w,bstrblobVal:8:@struct tagBSTRBLOB;,blob:8:@struct _BLOB;,pszVal:8:*c,pwszVal:8:*w,punkVal:8:*@IUnknown;,pdispVal:8:*@IDispatch;,pStream:8:*@IStream;,pStorage:8:*@IStorage;,pVersionedStream:8:*@struct tagVersionedStream;,parray:8:*@struct tagSAFEARRAY;,cac:8:@struct tagCAC;,caub:8:@struct tagCAUB;,cai:8:@struct tagCAI;,caui:8:@struct tagCAUI;,cal:8:@struct tagCAL;,caul:8:@struct tagCAUL;,cah:8:@struct tagCAH;,cauh:8:@struct tagCAUH;,caflt:8:@struct tagCAFLT;,cadbl:8:@struct tagCADBL;,cabool:8:@struct tagCABOOL;,cascode:8:@struct tagCASCODE;,cacy:8:@struct tagCACY;,cadate:8:@struct tagCADATE;,cafiletime:8:@struct tagCAFILETIME;,cauuid:8:@struct tagCACLSID;,caclipdata:8:@struct tagCACLIPDATA;,cabstr:8:@struct tagCABSTR;,cabstrblob:8:@struct tagCABSTRBLOB;,calpstr:8:@struct tagCALPSTR;,calpwstr:8:@struct tagCALPWSTR;,capropvar:8:@struct tagCAPROPVARIANT;,pcVal:8:*c,pbVal:8:*h,piVal:8:*s,puiVal:8:*t,plVal:8:*l,pulVal:8:*m,pintVal:8:*i,puintVal:8:*u,pfltVal:8:*f,pdblVal:8:*d,pboolVal:8:*s,pdecVal:8:*@struct tagDEC;,pscode:8:*l,pcyVal:8:*@union tagCY;,pdate:8:*d,pbstrVal:8:**w,ppunkVal:8:**@IUnknown;,ppdispVal:8:**@IDispatch;,pparray:8:**@struct tagSAFEARRAY;,pvarVal:8:*@struct tagPROPVARIANT;,decVal:0:@struct tagDEC;
struct tagRAWHID|12|4|s|5|dwSizeHid:0:m,dwCount:4:m,bRawData:8:[1]h
struct tagRAWINPUT|48|8|s|5|header:0:@struct tagRAWINPUTHEADER;,data:24:@struct tagRAWINPUT.data;
struct tagRAWINPUT.data|0|0|u|5|mouse:0:@struct tagRAWMOUSE;,keyboard:0:@struct tagRAWKEYBOARD;,hid:0:@struct tagRAWHID;
struct tagRAWINPUTDEVICE|16|8|s|5|usUsagePage:0:t,usUsage:2:t,dwFlags:4:m,hwndTarget:8:*@struct HWND__;
struct tagRAWINPUTDEVICELIST|16|8|s|5|hDevice:0:*v,dwType:8:m
struct tagRAWINPUTHEADER|24|8|s|5|dwType:0:m,dwSize:4:m,hDevice:8:*v,wParam:16:r
struct tagRAWKEYBOARD|16|4|s|5|MakeCode:0:t,Flags:2:t,Reserved:4:t,VKey:6:t,Message:8:u,ExtraInformation:12:m
struct tagRAWMOUSE|24|4|s|5|usFlags:0:t,ulButtons:4:m,usButtonFlags:4:t,usButtonData:6:t,ulRawButtons:8:m,lLastX:12:l,lLastY:16:l,ulExtraInformation:20:m
struct tagRECT|16|4|s|7|left:0:l,top:4:l,right:8:l,bottom:12:l
struct tagSAFEARRAY|32|8|s|6|cDims:0:t,fFeatures:2:t,cbElements:4:m,cLocks:8:m,pvData:16:*v,rgsabound:24:[1]@struct tagSAFEARRAYBOUND;
struct tagSAFEARRAYBOUND|8|4|s|6|cElements:0:m,lLbound:4:l
struct tagSCROLLBARINFO|60|4|s|5|cbSize:0:m,rcScrollBar:4:@struct tagRECT;,dxyLineButton:20:i,xyThumbTop:24:i,xyThumbBottom:28:i,reserved:32:i,rgstate:36:[6]m
struct tagSCROLLINFO|28|4|s|5|cbSize:0:u,fMask:4:u,nMin:8:i,nMax:12:i,nPage:16:u,nPos:20:i,nTrackPos:24:i
struct tagSIZE|8|4|s|7|cx:0:l,cy:4:l
struct tagTHREADENTRY32|28|4|s|1c|dwSize:0:m,cntUsage:4:m,th32ThreadID:8:m,th32OwnerProcessID:12:m,tpBasePri:16:l,tpDeltaPri:20:l,dwFlags:24:m
struct tagTITLEBARINFO|44|4|s|5|cbSize:0:m,rcTitleBar:4:@struct tagRECT;,rgstate:20:[6]m
struct tagTOUCHINPUT|48|8|s|5|x:0:l,y:4:l,hSource:8:*v,dwID:16:m,dwFlags:20:m,dwMask:24:m,dwTime:28:m,dwExtraInfo:32:r,cxContact:40:m,cyContact:44:m
struct tagTOUCH_HIT_TESTING_INPUT|48|4|s|5|pointerId:0:u,point:4:@struct tagPOINT;,boundingBox:12:@struct tagRECT;,nonOccludedBoundingBox:28:@struct tagRECT;,orientation:44:u
struct tagTOUCH_HIT_TESTING_PROXIMITY_EVALUATION|12|4|s|5|score:0:t,adjustedPoint:4:@struct tagPOINT;
struct tagTPMPARAMS|20|4|s|5|cbSize:0:u,rcExclude:4:@struct tagRECT;
struct tagTRACKMOUSEEVENT|24|8|s|5|cbSize:0:m,dwFlags:4:m,hwndTrack:8:*@struct HWND__;,dwHoverTime:16:m
struct tagUPDATELAYEREDWINDOWINFO|80|8|s|5|cbSize:0:m,hdcDst:8:*@struct HDC__;,pptDst:16:^@struct tagPOINT;,psize:24:^@struct tagSIZE;,hdcSrc:32:*@struct HDC__;,pptSrc:40:^@struct tagPOINT;,crKey:48:m,pblend:56:^@struct _BLENDFUNCTION;,dwFlags:64:m,prcDirty:72:^@struct tagRECT;
struct tagVARIANT|24|8|s|6|vt:0:t,wReserved1:2:t,wReserved2:4:t,wReserved3:6:t,llVal:8:q,lVal:8:l,bVal:8:h,iVal:8:s,fltVal:8:f,dblVal:8:d,boolVal:8:s,scode:8:l,cyVal:8:@union tagCY;,date:8:d,bstrVal:8:*w,punkVal:8:*@IUnknown;,pdispVal:8:*@IDispatch;,parray:8:*@struct tagSAFEARRAY;,pbVal:8:*h,piVal:8:*s,plVal:8:*l,pllVal:8:*q,pfltVal:8:*f,pdblVal:8:*d,pboolVal:8:*s,pscode:8:*l,pcyVal:8:*@union tagCY;,pdate:8:*d,pbstrVal:8:**w,ppunkVal:8:**@IUnknown;,ppdispVal:8:**@IDispatch;,pparray:8:**@struct tagSAFEARRAY;,pvarVal:8:*@struct tagVARIANT;,byref:8:*v,cVal:8:c,uiVal:8:t,ulVal:8:m,ullVal:8:r,intVal:8:i,uintVal:8:u,pdecVal:8:*@struct tagDEC;,pcVal:8:*c,puiVal:8:*t,pulVal:8:*m,pullVal:8:*r,pintVal:8:*i,puintVal:8:*u,pvRecord:8:*v,pRecInfo:16:*@IRecordInfo;,decVal:0:@struct tagDEC;
struct tagVersionedStream|24|8|s|6|guidVersion:0:@struct _GUID;,pStream:16:*@IStream;
struct tagWINDOWINFO|60|4|s|5|cbSize:0:m,rcWindow:4:@struct tagRECT;,rcClient:20:@struct tagRECT;,dwStyle:36:m,dwExStyle:40:m,dwWindowStatus:44:m,cxWindowBorders:48:u,cyWindowBorders:52:u,atomWindowType:56:t,wCreatorVersion:58:t
struct tagWINDOWPLACEMENT|44|4|s|4|length:0:u,flags:4:u,showCmd:8:u,ptMinPosition:12:@struct tagPOINT;,ptMaxPosition:20:@struct tagPOINT;,rcNormalPosition:28:@struct tagRECT;
struct tagWNDCLASSA|72|8|s|4|style:0:u,lpfnWndProc:8:p,cbClsExtra:16:i,cbWndExtra:20:i,hInstance:24:*@struct HINSTANCE__;,hIcon:32:*@struct HICON__;,hCursor:40:*@struct HICON__;,hbrBackground:48:*@struct HBRUSH__;,lpszMenuName:56:^c,lpszClassName:64:^c
struct tagWNDCLASSEXA|80|8|s|5|cbSize:0:u,style:4:u,lpfnWndProc:8:p,cbClsExtra:16:i,cbWndExtra:20:i,hInstance:24:*@struct HINSTANCE__;,hIcon:32:*@struct HICON__;,hCursor:40:*@struct HICON__;,hbrBackground:48:*@struct HBRUSH__;,lpszMenuName:56:^c,lpszClassName:64:^c,hIconSm:72:*@struct HICON__;
struct tagWNDCLASSEXW|80|8|s|5|cbSize:0:u,style:4:u,lpfnWndProc:8:p,cbClsExtra:16:i,cbWndExtra:20:i,hInstance:24:*@struct HINSTANCE__;,hIcon:32:*@struct HICON__;,hCursor:40:*@struct HICON__;,hbrBackground:48:*@struct HBRUSH__;,lpszMenuName:56:^w,lpszClassName:64:^w,hIconSm:72:*@struct HICON__;
struct tagWNDCLASSW|72|8|s|4|style:0:u,lpfnWndProc:8:p,cbClsExtra:16:i,cbWndExtra:20:i,hInstance:24:*@struct HINSTANCE__;,hIcon:32:*@struct HICON__;,hCursor:40:*@struct HICON__;,hbrBackground:48:*@struct HBRUSH__;,lpszMenuName:56:^w,lpszClassName:64:^w
struct timeb|16|8|s|x|time:0:q,millitm:8:t,timezone:10:s,dstflag:12:s
struct timespec|16|8|s|1d|tv_sec:0:q,tv_nsec:8:l
struct timeval|8|4|s|1e|tv_sec:0:l,tv_usec:4:l
struct tm|36|4|s|1f|tm_sec:0:i,tm_min:4:i,tm_hour:8:i,tm_mday:12:i,tm_mon:16:i,tm_year:20:i,tm_wday:24:i,tm_yday:28:i,tm_isdst:32:i
struct value_entA|32|8|s|4|ve_valuename:0:*c,ve_valuelen:8:m,ve_valueptr:16:r,ve_type:24:m
struct value_entW|32|8|s|4|ve_valuename:0:*w,ve_valuelen:8:m,ve_valueptr:16:r,ve_type:24:m
union _FILE_SEGMENT_ELEMENT|8|8|u|7|Buffer:0:*v,Alignment:0:r
union _LARGE_INTEGER|8|8|u|7|LowPart:0:m,HighPart:4:l,u:0:@union _LARGE_INTEGER.u;,QuadPart:0:q
union _LARGE_INTEGER.u|0|0|s|7|LowPart:0:m,HighPart:4:l
union _SLIST_HEADER|16|16|u|7|Alignment:0:r,Region:8:r,Header8:0:@union _SLIST_HEADER.Header8;,HeaderX64:0:@union _SLIST_HEADER.HeaderX64;
union _SLIST_HEADER.Header8|0|0|s|7|
union _SLIST_HEADER.HeaderX64|0|0|s|7|
union _ULARGE_INTEGER|8|8|u|7|LowPart:0:m,HighPart:4:m,u:0:@union _ULARGE_INTEGER.u;,QuadPart:0:r
union _ULARGE_INTEGER.u|0|0|s|7|LowPart:0:m,HighPart:4:m
union tagCY|8|8|u|14|Lo:0:m,Hi:4:l,int64:0:q
`,za=`O_CREAT=100
O_EXCL=400
O_TRUNC=200
O_APPEND=8
O_BINARY=8000
O_TEXT=4000
O_NOINHERIT=80
O_TEMPORARY=40
O_SEQUENTIAL=20
O_RANDOM=10
O_ACCMODE=3
O_RDONLY=0
O_WRONLY=1
O_RDWR=2
F_OK=0
R_OK=4
W_OK=2
X_OK=1
SEEK_SET=0
SEEK_CUR=1
SEEK_END=2
PROT_NONE=0
AF_UNSPEC=0
AF_UNIX=1
AF_INET=2
AF_INET6=17
SOCK_STREAM=1
SOCK_DGRAM=2
SOCK_RAW=3
SOCK_RDM=4
SOCK_SEQPACKET=5
IPPROTO_ICMP=1
IPPROTO_IGMP=2
IPPROTO_TCP=6
IPPROTO_UDP=11
IPPROTO_IPV6=29
IPPROTO_ICMPV6=3a
IPPROTO_RAW=ff
IPPROTO_SCTP=84
SOL_SOCKET=ffff
IPPROTO_IP=0
MSG_OOB=1
MSG_PEEK=2
MSG_DONTROUTE=4
MSG_WAITALL=8
SD_RECEIVE=0
SD_SEND=1
SD_BOTH=2
SIGINT=2
SIGILL=4
SIGABRT=16
SIGFPE=8
SIGSEGV=b
SIGTERM=f
SIGBREAK=15
SIG_DFL=0
SIG_IGN=1
SIG_ERR=-1
CLOCK_REALTIME=0
CLOCK_MONOTONIC=1
CLOCK_PROCESS_CPUTIME_ID=2
CLOCK_THREAD_CPUTIME_ID=3
CLOCK_REALTIME_COARSE=4
LC_ALL=0
LC_COLLATE=1
LC_CTYPE=2
LC_MONETARY=3
LC_NUMERIC=4
LC_TIME=5
_IOFBF=0
_IOLBF=40
_IONBF=4
FIONREAD=4004667f
FIONBIO=8004667e
GENERIC_READ=80000000
GENERIC_WRITE=40000000
GENERIC_EXECUTE=20000000
GENERIC_ALL=10000000
MAXIMUM_ALLOWED=2000000
DELETE=10000
READ_CONTROL=20000
WRITE_DAC=40000
WRITE_OWNER=80000
SYNCHRONIZE=100000
FILE_READ_DATA=1
FILE_WRITE_DATA=2
FILE_APPEND_DATA=4
FILE_READ_EA=8
FILE_WRITE_EA=10
FILE_EXECUTE=20
FILE_READ_ATTRIBUTES=80
FILE_WRITE_ATTRIBUTES=100
FILE_SHARE_READ=1
FILE_SHARE_WRITE=2
FILE_SHARE_DELETE=4
CREATE_NEW=1
CREATE_ALWAYS=2
OPEN_EXISTING=3
OPEN_ALWAYS=4
TRUNCATE_EXISTING=5
FILE_ATTRIBUTE_READONLY=1
FILE_ATTRIBUTE_HIDDEN=2
FILE_ATTRIBUTE_SYSTEM=4
FILE_ATTRIBUTE_DIRECTORY=10
FILE_ATTRIBUTE_ARCHIVE=20
FILE_ATTRIBUTE_DEVICE=40
FILE_ATTRIBUTE_NORMAL=80
FILE_ATTRIBUTE_TEMPORARY=100
FILE_ATTRIBUTE_SPARSE_FILE=200
FILE_ATTRIBUTE_REPARSE_POINT=400
FILE_ATTRIBUTE_COMPRESSED=800
FILE_ATTRIBUTE_OFFLINE=1000
FILE_ATTRIBUTE_NOT_CONTENT_INDEXED=2000
FILE_ATTRIBUTE_ENCRYPTED=4000
FILE_FLAG_WRITE_THROUGH=80000000
FILE_FLAG_OVERLAPPED=40000000
FILE_FLAG_NO_BUFFERING=20000000
FILE_FLAG_RANDOM_ACCESS=10000000
FILE_FLAG_SEQUENTIAL_SCAN=8000000
FILE_FLAG_DELETE_ON_CLOSE=4000000
FILE_FLAG_BACKUP_SEMANTICS=2000000
FILE_FLAG_POSIX_SEMANTICS=1000000
FILE_FLAG_OPEN_REPARSE_POINT=200000
FILE_FLAG_OPEN_NO_RECALL=100000
MEM_COMMIT=1000
MEM_RESERVE=2000
MEM_RESET=80000
MEM_RESET_UNDO=1000000
MEM_TOP_DOWN=100000
MEM_WRITE_WATCH=200000
MEM_PHYSICAL=400000
MEM_LARGE_PAGES=20000000
MEM_DECOMMIT=4000
MEM_RELEASE=8000
PAGE_NOACCESS=1
PAGE_READONLY=2
PAGE_READWRITE=4
PAGE_WRITECOPY=8
PAGE_EXECUTE=10
PAGE_EXECUTE_READ=20
PAGE_EXECUTE_READWRITE=40
PAGE_EXECUTE_WRITECOPY=80
PAGE_GUARD=100
PAGE_NOCACHE=200
PAGE_WRITECOMBINE=400
SEC_IMAGE=1000000
SEC_RESERVE=4000000
SEC_COMMIT=8000000
SEC_NOCACHE=10000000
FILE_MAP_ALL_ACCESS=f001f
FILE_MAP_READ=4
FILE_MAP_WRITE=2
FILE_MAP_COPY=1
FILE_MAP_EXECUTE=20
FILE_BEGIN=0
FILE_CURRENT=1
FILE_END=2
PROCESS_ALL_ACCESS=1fffff
PROCESS_TERMINATE=1
PROCESS_CREATE_THREAD=2
PROCESS_VM_OPERATION=8
PROCESS_VM_READ=10
PROCESS_VM_WRITE=20
PROCESS_DUP_HANDLE=40
PROCESS_CREATE_PROCESS=80
PROCESS_SET_QUOTA=100
PROCESS_SET_INFORMATION=200
PROCESS_QUERY_INFORMATION=400
PROCESS_SUSPEND_RESUME=800
PROCESS_QUERY_LIMITED_INFORMATION=1000
THREAD_ALL_ACCESS=1fffff
THREAD_TERMINATE=1
THREAD_SUSPEND_RESUME=2
THREAD_GET_CONTEXT=8
THREAD_SET_CONTEXT=10
THREAD_QUERY_INFORMATION=40
THREAD_SET_INFORMATION=20
DEBUG_PROCESS=1
DEBUG_ONLY_THIS_PROCESS=2
CREATE_SUSPENDED=4
DETACHED_PROCESS=8
CREATE_NEW_CONSOLE=10
NORMAL_PRIORITY_CLASS=20
IDLE_PRIORITY_CLASS=40
HIGH_PRIORITY_CLASS=80
REALTIME_PRIORITY_CLASS=100
CREATE_NEW_PROCESS_GROUP=200
CREATE_UNICODE_ENVIRONMENT=400
CREATE_BREAKAWAY_FROM_JOB=1000000
CREATE_DEFAULT_ERROR_MODE=4000000
CREATE_NO_WINDOW=8000000
EXTENDED_STARTUPINFO_PRESENT=80000
STACK_SIZE_PARAM_IS_A_RESERVATION=10000
INFINITE=ffffffff
STD_INPUT_HANDLE=fffffff6
STD_OUTPUT_HANDLE=fffffff5
STD_ERROR_HANDLE=fffffff4
HEAP_NO_SERIALIZE=1
HEAP_GROWABLE=2
HEAP_GENERATE_EXCEPTIONS=4
HEAP_ZERO_MEMORY=8
HEAP_REALLOC_IN_PLACE_ONLY=10
HEAP_CREATE_ENABLE_EXECUTE=40000
LMEM_MOVEABLE=2
LMEM_ZEROINIT=40
LMEM_FIXED=0
GMEM_MOVEABLE=2
GMEM_ZEROINIT=40
GMEM_FIXED=0
DONT_RESOLVE_DLL_REFERENCES=1
LOAD_LIBRARY_AS_DATAFILE=2
LOAD_WITH_ALTERED_SEARCH_PATH=8
LOAD_IGNORE_CODE_AUTHZ_LEVEL=10
LOAD_LIBRARY_AS_IMAGE_RESOURCE=20
LOAD_LIBRARY_AS_DATAFILE_EXCLUSIVE=40
LOAD_LIBRARY_SEARCH_DLL_LOAD_DIR=100
LOAD_LIBRARY_SEARCH_APPLICATION_DIR=200
LOAD_LIBRARY_SEARCH_USER_DIRS=400
LOAD_LIBRARY_SEARCH_SYSTEM32=800
LOAD_LIBRARY_SEARCH_DEFAULT_DIRS=1000
HKEY_CLASSES_ROOT=-80000000
HKEY_CURRENT_USER=-7fffffff
HKEY_LOCAL_MACHINE=-7ffffffe
HKEY_USERS=-7ffffffd
HKEY_PERFORMANCE_DATA=-7ffffffc
HKEY_CURRENT_CONFIG=-7ffffffb
KEY_ALL_ACCESS=f003f
KEY_READ=20019
KEY_WRITE=20006
KEY_QUERY_VALUE=1
KEY_SET_VALUE=2
KEY_CREATE_SUB_KEY=4
KEY_ENUMERATE_SUB_KEYS=8
KEY_NOTIFY=10
KEY_CREATE_LINK=20
KEY_WOW64_64KEY=100
KEY_WOW64_32KEY=200
REG_OPTION_VOLATILE=1
REG_OPTION_CREATE_LINK=2
REG_OPTION_BACKUP_RESTORE=4
REG_NONE=0
REG_SZ=1
REG_EXPAND_SZ=2
REG_BINARY=3
REG_DWORD=4
REG_DWORD_BIG_ENDIAN=5
REG_LINK=6
REG_MULTI_SZ=7
REG_QWORD=b
CP_ACP=0
CP_OEMCP=1
CP_MACCP=2
CP_THREAD_ACP=3
CP_UTF7=fde8
CP_UTF8=fde9
FORMAT_MESSAGE_ALLOCATE_BUFFER=100
FORMAT_MESSAGE_IGNORE_INSERTS=200
FORMAT_MESSAGE_FROM_STRING=400
FORMAT_MESSAGE_FROM_HMODULE=800
FORMAT_MESSAGE_FROM_SYSTEM=1000
FORMAT_MESSAGE_ARGUMENT_ARRAY=2000
TH32CS_SNAPALL=f
TH32CS_SNAPHEAPLIST=1
TH32CS_SNAPPROCESS=2
TH32CS_SNAPTHREAD=4
TH32CS_SNAPMODULE=8
TH32CS_SNAPMODULE32=10
TH32CS_INHERIT=80000000
DUPLICATE_CLOSE_SOURCE=1
DUPLICATE_SAME_ACCESS=2
MB_DEFBUTTON2=100
MB_DEFBUTTON3=200
MB_SYSTEMMODAL=1000
MB_TASKMODAL=2000
MB_SETFOREGROUND=10000
MB_TOPMOST=40000
MB_SERVICE_NOTIFICATION=200000
MB_TYPEMASK=f
MB_OK=0
MB_OKCANCEL=1
MB_ABORTRETRYIGNORE=2
MB_YESNOCANCEL=3
MB_YESNO=4
MB_RETRYCANCEL=5
MB_CANCELTRYCONTINUE=6
MB_ICONMASK=f0
MB_ICONERROR=10
MB_ICONQUESTION=20
MB_ICONWARNING=30
MB_ICONINFORMATION=40
SW_HIDE=0
SW_SHOWNORMAL=1
SW_SHOWMINIMIZED=2
SW_SHOWMAXIMIZED=3
SW_SHOWNOACTIVATE=4
SW_SHOW=5
SW_MINIMIZE=6
SW_SHOWMINNOACTIVE=7
SW_SHOWNA=8
SW_RESTORE=9
SW_SHOWDEFAULT=a
SW_FORCEMINIMIZE=b
WM_NULL=0
WM_CREATE=1
WM_DESTROY=2
WM_MOVE=3
WM_SIZE=5
WM_ACTIVATE=6
WM_SETFOCUS=7
WM_KILLFOCUS=8
WM_ENABLE=a
WM_SETTEXT=c
WM_GETTEXT=d
WM_GETTEXTLENGTH=e
WM_PAINT=f
WM_CLOSE=10
WM_QUIT=12
WM_SHOWWINDOW=18
WM_SETCURSOR=20
WM_GETMINMAXINFO=24
WM_NOTIFY=4e
WM_SETICON=80
WM_KEYDOWN=100
WM_KEYUP=101
WM_CHAR=102
WM_INITDIALOG=110
WM_COMMAND=111
WM_SYSCOMMAND=112
WM_TIMER=113
WM_HSCROLL=114
WM_VSCROLL=115
WM_MOUSEMOVE=200
WM_LBUTTONDOWN=201
WM_LBUTTONUP=202
WM_RBUTTONDOWN=204
WM_RBUTTONUP=205
WM_MOUSEWHEEL=20a
WM_USER=400
WM_APP=8000
GWLP_WNDPROC=-4
GWLP_HINSTANCE=-6
GWLP_HWNDPARENT=-8
GWLP_ID=-c
GWL_STYLE=-10
GWL_EXSTYLE=-14
GWLP_USERDATA=-15
`;var Wa=Object.freeze({__proto__:null,constants:za,headers:xa,provenance:Ma,records:Ha});const Ua={"sysv-amd64":ka,"darwin-arm64":Da,"windows-x64":Wa};class Ba{module;lines=new Map;aliases=new Map;decoded=new Map;constantValues;constructor(e){this.module=e;for(const t of e.records.split(`
`)){if(!t)continue;const i=t.indexOf("|");t.startsWith("=")?this.aliases.set(t.slice(1,i),t.slice(i+1)):this.lines.set(t.slice(0,i),t.slice(i+1))}}record(e){let t=e;for(let d=0;d<8&&!this.lines.has(t);d++){const h=this.aliases.get(t);if(h===void 0)return;t=h}const i=this.decoded.get(t);if(i)return i;const a=this.lines.get(t);if(a===void 0)return;const[r,n,o,c,_]=a.split("|"),u={name:t,size:r==="0"?null:Number(r),alignment:n==="0"?null:Number(n),union:o==="u",header:this.module.headers[Number.parseInt(c,36)]??"",fields:_?_.split(",").map(d=>{const h=d.indexOf(":"),C=d.indexOf(":",h+1);return{name:d.slice(0,h),offset:Number(d.slice(h+1,C)),type:Ga(d.slice(C+1))}}):[],source:this.module.provenance};return this.decoded.set(t,u),u}names(){return[...this.lines.keys(),...this.aliases.keys()].filter(e=>!e.includes(".")&&this.record(e)!==void 0).sort()}constant(e){if(!this.constantValues){this.constantValues=new Map;for(const t of this.module.constants.split(`
`)){const i=t.indexOf("=");if(i<0)continue;const a=t.slice(i+1),r=a.startsWith("-")?-BigInt(`0x${a.slice(1)}`):BigInt(`0x${a}`);this.constantValues.set(t.slice(0,i),r)}}return this.constantValues.get(e)}}function Ga(s){const e={at:0},t=it(s,e);if(e.at!==s.length)throw new TypeError(`Malformed library field type ${s}`);return t}function it(s,e){const t=s[e.at++];switch(t){case"[":{const i=s.indexOf("]",e.at),a=s.slice(e.at,i);return e.at=i+1,{kind:"array",of:it(s,e),count:a?Number(a):null}}case"*":case"^":{const i=it(s,e),a=typeof i=="object"&&i.kind==="array"?Va(i):i;return t==="^"?{kind:"pointer",to:a,const:!0}:{kind:"pointer",to:a}}case"@":{const i=s.indexOf(";",e.at),a=s.slice(e.at,i);return e.at=i+1,a.startsWith("!")?{kind:"opaque",name:a.slice(1),spelled:!1}:{kind:"opaque",name:a}}default:{const i=ni[t];if(i===void 0)throw new TypeError(`Unknown library field code ${t}`);return i}}}function Va(s){for(;typeof s=="object"&&s.kind==="array";)s=s.of;return s}const Gt=new Map;function Oe(s){let e=Gt.get(s);return e||(e=new Ba(Ua[s]),Gt.set(s,e)),e}function Xs(s,e){return Oe(s).record(e)??(e.startsWith("__darwin_")?Oe(s).record(e.slice(9)):void 0)}function $s(s){return Oe(s).names()}function Qs(s,e){return Oe(s).constant(e)}var Ka=""+new URL("index_bg-DgKnAYy9.wasm",import.meta.url).href;let ie;function _i(s){ie=s}let rt=0,Re=null;function ve(){return(Re===null||Re.byteLength===0)&&(Re=new Uint8Array(ie.memory.buffer)),Re}const Ya=typeof TextEncoder>"u"?(0,module.require)("util").TextEncoder:TextEncoder;let De=new Ya("utf-8");const ja=typeof De.encodeInto=="function"?function(s,e){return De.encodeInto(s,e)}:function(s,e){const t=De.encode(s);return e.set(t),{read:s.length,written:t.length}};function qa(s,e,t){if(t===void 0){const o=De.encode(s),c=e(o.length,1)>>>0;return ve().subarray(c,c+o.length).set(o),rt=o.length,c}let i=s.length,a=e(i,1)>>>0;const r=ve();let n=0;for(;n<i;n++){const o=s.charCodeAt(n);if(o>127)break;r[a+n]=o}if(n!==i){n!==0&&(s=s.slice(n)),a=t(a,i,i=n+s.length*3,1)>>>0;const o=ve().subarray(a+n,a+i),c=ja(s,o);n+=c.written,a=t(a,i,n,1)>>>0}return rt=n,a}const Xa=typeof TextDecoder>"u"?(0,module.require)("util").TextDecoder:TextDecoder;let ui=new Xa("utf-8",{ignoreBOM:!0,fatal:!0});ui.decode();function $a(s,e){return s=s>>>0,ui.decode(ve().subarray(s,s+e))}function di(s){let e,t;try{const i=qa(s,ie.__wbindgen_malloc,ie.__wbindgen_realloc),a=rt,r=ie.demangle_any(i,a);return e=r[0],t=r[1],$a(r[0],r[1])}finally{ie.__wbindgen_free(e,t,1)}}function Qa(){const s=ie.__wbindgen_export_0,e=s.grow(4);s.set(0,void 0),s.set(e+0,void 0),s.set(e+1,null),s.set(e+2,!0),s.set(e+3,!1)}var Za=Object.freeze({__proto__:null,__wbg_set_wasm:_i,__wbindgen_init_externref_table:Qa,demangle_any:di});const Ye=0,je=1,U=0,L=8,Vt=28,Ja=37,es=52,qe=58;class pe{static read_bytes(e,t){const i=new pe;return i.buf=e.getUint32(t,!0),i.buf_len=e.getUint32(t+4,!0),i}static read_bytes_array(e,t,i){const a=[];for(let r=0;r<i;r++)a.push(pe.read_bytes(e,t+8*r));return a}}class fe{static read_bytes(e,t){const i=new fe;return i.buf=e.getUint32(t,!0),i.buf_len=e.getUint32(t+4,!0),i}static read_bytes_array(e,t,i){const a=[];for(let r=0;r<i;r++)a.push(fe.read_bytes(e,t+8*r));return a}}const ts=0,is=1;class ot{static read_bytes(e,t){return new ot(e.getBigUint64(t,!0),e.getUint8(t+8),e.getUint32(t+16,!0),e.getBigUint64(t+24,!0),e.getUint16(t+36,!0))}constructor(e,t,i,a,r){this.userdata=e,this.eventtype=t,this.clockid=i,this.timeout=a,this.flags=r}}class rs{write_bytes(e,t){e.setBigUint64(t,this.userdata,!0),e.setUint16(t+8,this.error,!0),e.setUint8(t+10,this.eventtype)}constructor(e,t,i){this.userdata=e,this.error=t,this.eventtype=i}}let as=class{enable(e){this.log=ss(e===void 0?!0:e,this.prefix)}get enabled(){return this.isEnabled}constructor(e){this.isEnabled=e,this.prefix="wasi:",this.enable(e)}};function ss(s,e){return s?console.log.bind(console,"%c%s","color: #265BA0",e):()=>{}}const $=new as(!1);class Kt extends Error{constructor(e){super("exit with exit code "+e),this.code=e}}let ns=class{start(e){this.inst=e;try{return e.exports._start(),0}catch(t){if(t instanceof Kt)return t.code;throw t}}initialize(e){this.inst=e,e.exports._initialize&&e.exports._initialize()}constructor(e,t,i,a={}){this.args=[],this.env=[],this.fds=[],$.enable(a.debug),this.args=e,this.env=t,this.fds=i;const r=this;this.wasiImport={args_sizes_get(n,o){const c=new DataView(r.inst.exports.memory.buffer);c.setUint32(n,r.args.length,!0);let _=0;for(const u of r.args)_+=u.length+1;return c.setUint32(o,_,!0),$.log(c.getUint32(n,!0),c.getUint32(o,!0)),0},args_get(n,o){const c=new DataView(r.inst.exports.memory.buffer),_=new Uint8Array(r.inst.exports.memory.buffer),u=o;for(let d=0;d<r.args.length;d++){c.setUint32(n,o,!0),n+=4;const h=new TextEncoder().encode(r.args[d]);_.set(h,o),c.setUint8(o+h.length,0),o+=h.length+1}return $.enabled&&$.log(new TextDecoder("utf-8").decode(_.slice(u,o))),0},environ_sizes_get(n,o){const c=new DataView(r.inst.exports.memory.buffer);c.setUint32(n,r.env.length,!0);let _=0;for(const u of r.env)_+=new TextEncoder().encode(u).length+1;return c.setUint32(o,_,!0),$.log(c.getUint32(n,!0),c.getUint32(o,!0)),0},environ_get(n,o){const c=new DataView(r.inst.exports.memory.buffer),_=new Uint8Array(r.inst.exports.memory.buffer),u=o;for(let d=0;d<r.env.length;d++){c.setUint32(n,o,!0),n+=4;const h=new TextEncoder().encode(r.env[d]);_.set(h,o),c.setUint8(o+h.length,0),o+=h.length+1}return $.enabled&&$.log(new TextDecoder("utf-8").decode(_.slice(u,o))),0},clock_res_get(n,o){let c;switch(n){case je:{c=5000n;break}case Ye:{c=1000000n;break}default:return es}return new DataView(r.inst.exports.memory.buffer).setBigUint64(o,c,!0),U},clock_time_get(n,o,c){const _=new DataView(r.inst.exports.memory.buffer);if(n===Ye)_.setBigUint64(c,BigInt(new Date().getTime())*1000000n,!0);else if(n==je){let u;try{u=BigInt(Math.round(performance.now()*1e6))}catch{u=0n}_.setBigUint64(c,u,!0)}else _.setBigUint64(c,0n,!0);return 0},fd_advise(n,o,c,_){return r.fds[n]!=null?U:L},fd_allocate(n,o,c){return r.fds[n]!=null?r.fds[n].fd_allocate(o,c):L},fd_close(n){if(r.fds[n]!=null){const o=r.fds[n].fd_close();return r.fds[n]=void 0,o}else return L},fd_datasync(n){return r.fds[n]!=null?r.fds[n].fd_sync():L},fd_fdstat_get(n,o){if(r.fds[n]!=null){const{ret:c,fdstat:_}=r.fds[n].fd_fdstat_get();return _?.write_bytes(new DataView(r.inst.exports.memory.buffer),o),c}else return L},fd_fdstat_set_flags(n,o){return r.fds[n]!=null?r.fds[n].fd_fdstat_set_flags(o):L},fd_fdstat_set_rights(n,o,c){return r.fds[n]!=null?r.fds[n].fd_fdstat_set_rights(o,c):L},fd_filestat_get(n,o){if(r.fds[n]!=null){const{ret:c,filestat:_}=r.fds[n].fd_filestat_get();return _?.write_bytes(new DataView(r.inst.exports.memory.buffer),o),c}else return L},fd_filestat_set_size(n,o){return r.fds[n]!=null?r.fds[n].fd_filestat_set_size(o):L},fd_filestat_set_times(n,o,c,_){return r.fds[n]!=null?r.fds[n].fd_filestat_set_times(o,c,_):L},fd_pread(n,o,c,_,u){const d=new DataView(r.inst.exports.memory.buffer),h=new Uint8Array(r.inst.exports.memory.buffer);if(r.fds[n]!=null){const C=pe.read_bytes_array(d,o,c);let m=0;for(const p of C){const{ret:S,data:F}=r.fds[n].fd_pread(p.buf_len,_);if(S!=U)return d.setUint32(u,m,!0),S;if(h.set(F,p.buf),m+=F.length,_+=BigInt(F.length),F.length!=p.buf_len)break}return d.setUint32(u,m,!0),U}else return L},fd_prestat_get(n,o){const c=new DataView(r.inst.exports.memory.buffer);if(r.fds[n]!=null){const{ret:_,prestat:u}=r.fds[n].fd_prestat_get();return u?.write_bytes(c,o),_}else return L},fd_prestat_dir_name(n,o,c){if(r.fds[n]!=null){const{ret:_,prestat:u}=r.fds[n].fd_prestat_get();if(u==null)return _;const d=u.inner.pr_name;return new Uint8Array(r.inst.exports.memory.buffer).set(d.slice(0,c),o),d.byteLength>c?Ja:U}else return L},fd_pwrite(n,o,c,_,u){const d=new DataView(r.inst.exports.memory.buffer),h=new Uint8Array(r.inst.exports.memory.buffer);if(r.fds[n]!=null){const C=fe.read_bytes_array(d,o,c);let m=0;for(const p of C){const S=h.slice(p.buf,p.buf+p.buf_len),{ret:F,nwritten:y}=r.fds[n].fd_pwrite(S,_);if(F!=U)return d.setUint32(u,m,!0),F;if(m+=y,_+=BigInt(y),y!=S.byteLength)break}return d.setUint32(u,m,!0),U}else return L},fd_read(n,o,c,_){const u=new DataView(r.inst.exports.memory.buffer),d=new Uint8Array(r.inst.exports.memory.buffer);if(r.fds[n]!=null){const h=pe.read_bytes_array(u,o,c);let C=0;for(const m of h){const{ret:p,data:S}=r.fds[n].fd_read(m.buf_len);if(p!=U)return u.setUint32(_,C,!0),p;if(d.set(S,m.buf),C+=S.length,S.length!=m.buf_len)break}return u.setUint32(_,C,!0),U}else return L},fd_readdir(n,o,c,_,u){const d=new DataView(r.inst.exports.memory.buffer),h=new Uint8Array(r.inst.exports.memory.buffer);if(r.fds[n]!=null){let C=0;for(;;){const{ret:m,dirent:p}=r.fds[n].fd_readdir_single(_);if(m!=0)return d.setUint32(u,C,!0),m;if(p==null)break;if(c-C<p.head_length()){C=c;break}const S=new ArrayBuffer(p.head_length());if(p.write_head_bytes(new DataView(S),0),h.set(new Uint8Array(S).slice(0,Math.min(S.byteLength,c-C)),o),o+=p.head_length(),C+=p.head_length(),c-C<p.name_length()){C=c;break}p.write_name_bytes(h,o,c-C),o+=p.name_length(),C+=p.name_length(),_=p.d_next}return d.setUint32(u,C,!0),0}else return L},fd_renumber(n,o){if(r.fds[n]!=null&&r.fds[o]!=null){const c=r.fds[o].fd_close();return c!=0?c:(r.fds[o]=r.fds[n],r.fds[n]=void 0,0)}else return L},fd_seek(n,o,c,_){const u=new DataView(r.inst.exports.memory.buffer);if(r.fds[n]!=null){const{ret:d,offset:h}=r.fds[n].fd_seek(o,c);return u.setBigInt64(_,h,!0),d}else return L},fd_sync(n){return r.fds[n]!=null?r.fds[n].fd_sync():L},fd_tell(n,o){const c=new DataView(r.inst.exports.memory.buffer);if(r.fds[n]!=null){const{ret:_,offset:u}=r.fds[n].fd_tell();return c.setBigUint64(o,u,!0),_}else return L},fd_write(n,o,c,_){const u=new DataView(r.inst.exports.memory.buffer),d=new Uint8Array(r.inst.exports.memory.buffer);if(r.fds[n]!=null){const h=fe.read_bytes_array(u,o,c);let C=0;for(const m of h){const p=d.slice(m.buf,m.buf+m.buf_len),{ret:S,nwritten:F}=r.fds[n].fd_write(p);if(S!=U)return u.setUint32(_,C,!0),S;if(C+=F,F!=p.byteLength)break}return u.setUint32(_,C,!0),U}else return L},path_create_directory(n,o,c){const _=new Uint8Array(r.inst.exports.memory.buffer);if(r.fds[n]!=null){const u=new TextDecoder("utf-8").decode(_.slice(o,o+c));return r.fds[n].path_create_directory(u)}else return L},path_filestat_get(n,o,c,_,u){const d=new DataView(r.inst.exports.memory.buffer),h=new Uint8Array(r.inst.exports.memory.buffer);if(r.fds[n]!=null){const C=new TextDecoder("utf-8").decode(h.slice(c,c+_)),{ret:m,filestat:p}=r.fds[n].path_filestat_get(o,C);return p?.write_bytes(d,u),m}else return L},path_filestat_set_times(n,o,c,_,u,d,h){const C=new Uint8Array(r.inst.exports.memory.buffer);if(r.fds[n]!=null){const m=new TextDecoder("utf-8").decode(C.slice(c,c+_));return r.fds[n].path_filestat_set_times(o,m,u,d,h)}else return L},path_link(n,o,c,_,u,d,h){const C=new Uint8Array(r.inst.exports.memory.buffer);if(r.fds[n]!=null&&r.fds[u]!=null){const m=new TextDecoder("utf-8").decode(C.slice(c,c+_)),p=new TextDecoder("utf-8").decode(C.slice(d,d+h)),{ret:S,inode_obj:F}=r.fds[n].path_lookup(m,o);return F==null?S:r.fds[u].path_link(p,F,!1)}else return L},path_open(n,o,c,_,u,d,h,C,m){const p=new DataView(r.inst.exports.memory.buffer),S=new Uint8Array(r.inst.exports.memory.buffer);if(r.fds[n]!=null){const F=new TextDecoder("utf-8").decode(S.slice(c,c+_));$.log(F);const{ret:y,fd_obj:k}=r.fds[n].path_open(o,F,u,d,h,C);if(y!=0)return y;r.fds.push(k);const I=r.fds.length-1;return p.setUint32(m,I,!0),0}else return L},path_readlink(n,o,c,_,u,d){const h=new DataView(r.inst.exports.memory.buffer),C=new Uint8Array(r.inst.exports.memory.buffer);if(r.fds[n]!=null){const m=new TextDecoder("utf-8").decode(C.slice(o,o+c));$.log(m);const{ret:p,data:S}=r.fds[n].path_readlink(m);if(S!=null){const F=new TextEncoder().encode(S);if(F.length>u)return h.setUint32(d,0,!0),L;C.set(F,_),h.setUint32(d,F.length,!0)}return p}else return L},path_remove_directory(n,o,c){const _=new Uint8Array(r.inst.exports.memory.buffer);if(r.fds[n]!=null){const u=new TextDecoder("utf-8").decode(_.slice(o,o+c));return r.fds[n].path_remove_directory(u)}else return L},path_rename(n,o,c,_,u,d){const h=new Uint8Array(r.inst.exports.memory.buffer);if(r.fds[n]!=null&&r.fds[_]!=null){const C=new TextDecoder("utf-8").decode(h.slice(o,o+c)),m=new TextDecoder("utf-8").decode(h.slice(u,u+d));let{ret:p,inode_obj:S}=r.fds[n].path_unlink(C);if(S==null)return p;if(p=r.fds[_].path_link(m,S,!0),p!=U&&r.fds[n].path_link(C,S,!0)!=U)throw"path_link should always return success when relinking an inode back to the original place";return p}else return L},path_symlink(n,o,c,_,u){const d=new Uint8Array(r.inst.exports.memory.buffer);return r.fds[c]!=null?(new TextDecoder("utf-8").decode(d.slice(n,n+o)),new TextDecoder("utf-8").decode(d.slice(_,_+u)),qe):L},path_unlink_file(n,o,c){const _=new Uint8Array(r.inst.exports.memory.buffer);if(r.fds[n]!=null){const u=new TextDecoder("utf-8").decode(_.slice(o,o+c));return r.fds[n].path_unlink_file(u)}else return L},poll_oneoff(n,o,c){if(c===0)return Vt;if(c>1)return $.log("poll_oneoff: only a single subscription is supported"),qe;const _=new DataView(r.inst.exports.memory.buffer),u=ot.read_bytes(_,n),d=u.eventtype,h=u.clockid,C=u.timeout;if(d!==ts)return $.log("poll_oneoff: only clock subscriptions are supported"),qe;let m;if(h===je)m=()=>BigInt(Math.round(performance.now()*1e6));else if(h===Ye)m=()=>BigInt(new Date().getTime())*1000000n;else return Vt;const p=(u.flags&is)!==0?C:m()+C;for(;p>m(););return new rs(u.userdata,U,d).write_bytes(_,o),U},proc_exit(n){throw new Kt(n)},proc_raise(n){throw"raised signal "+n},sched_yield(){},random_get(n,o){const c=new Uint8Array(r.inst.exports.memory.buffer).subarray(n,n+o);if("crypto"in globalThis&&(typeof SharedArrayBuffer>"u"||!(r.inst.exports.memory.buffer instanceof SharedArrayBuffer)))for(let _=0;_<o;_+=65536)crypto.getRandomValues(c.subarray(_,_+65536));else for(let _=0;_<o;_++)c[_]=Math.random()*256|0},sock_recv(n,o,c){throw"sockets not supported"},sock_send(n,o,c){throw"sockets not supported"},sock_shutdown(n,o){throw"sockets not supported"},sock_accept(n,o){throw"sockets not supported"}}}};var os=class{constructor(s){if(typeof FinalizationRegistry>"u")throw new Error("The Swift part of JavaScriptKit was configured to require the availability of JavaScript WeakRefs. Please build with `-Xswiftc -DJAVASCRIPTKIT_WITHOUT_WEAKREFS` to disable features that use WeakRefs.");this.functionRegistry=new FinalizationRegistry(e=>{s.swjs_free_host_function(e)})}track(s,e){this.functionRegistry.register(s,e)}};function mi(s,e){throw new Error(e)}var Xe=-1,at=(s,e,t,i)=>{switch(s){case 0:switch(e){case 0:return!1;case 1:return!0}case 2:return t;case 1:case 3:case 6:case 7:case 8:return i.getObject(e);case 4:return null;case 5:return;default:mi(s,`JSValue Type kind "${s}" is not supported`)}},se=(s,e,t,i)=>{if(e===0)return[];let a=[];for(let r=0;r<e;r++){const n=s+16*r,o=t.getUint32(n,!0),c=t.getUint32(n+4,!0),_=t.getFloat64(n+8,!0);a.push(at(o,c,_,i))}return a},$e=(s,e,t,i,a,r,n)=>{const o=Q(s,t,i,a,r,n);r.setUint32(e,o,!0)},Q=(s,e,t,i,a,r)=>{const n=(i?1:0)<<31;if(s===null)return n|4;const o=_=>(a.setUint32(e,r.retain(s),!0),n|_),c=typeof s;switch(c){case"boolean":return a.setUint32(e,s?1:0,!0),n|0;case"number":return a.setFloat64(t,s,!0),n|2;case"string":return o(1);case"undefined":return n|5;case"object":return o(3);case"function":return o(6);case"symbol":return o(7);case"bigint":return o(8);default:mi(c,`Type "${c}" is not supported yet`)}throw new Error("Unreachable")};function Qe(s,e,t){const i=new Array(e);for(let a=0;a<e;a++)i[a]=t.getUint32(s+4*a,!0);return i}var cs=class{constructor(s){this.memory=s}send(s,e,t){const i=this.memory.getObject(s),a=e.map(r=>this.memory.getObject(r));return{object:i,sendingContext:t,transfer:a}}sendObjects(s,e,t){const i=s.map(r=>this.memory.getObject(r)),a=e.map(r=>this.memory.getObject(r));return{object:i,sendingContext:t,transfer:a}}release(s){return this.memory.release(s),{object:void 0,transfer:[]}}},ls=class{constructor(s,e,t){this.selfTid=s,this.threadChannel=e,this.handlers=t}request(s){if(s.data.targetTid==this.selfTid)this.handlers.onRequest(s);else if("postMessageToWorkerThread"in this.threadChannel)this.threadChannel.postMessageToWorkerThread(s.data.targetTid,s,[]);else if("postMessageToMainThread"in this.threadChannel)this.threadChannel.postMessageToMainThread(s,[]);else throw new Error("unreachable")}reply(s){if(s.data.sourceTid==this.selfTid){this.handlers.onResponse(s);return}const e=s.data.response.ok?s.data.response.value.transfer:[];if("postMessageToWorkerThread"in this.threadChannel)this.threadChannel.postMessageToWorkerThread(s.data.sourceTid,s,e);else if("postMessageToMainThread"in this.threadChannel)this.threadChannel.postMessageToMainThread(s,e);else throw new Error("unreachable")}onReceivingRequest(s){if(s.data.targetTid==this.selfTid)this.handlers.onRequest(s);else if("postMessageToWorkerThread"in this.threadChannel)this.threadChannel.postMessageToWorkerThread(s.data.targetTid,s,[]);else if("postMessageToMainThread"in this.threadChannel)throw new Error("unreachable")}onReceivingResponse(s){if(s.data.sourceTid==this.selfTid)this.handlers.onResponse(s);else if("postMessageToWorkerThread"in this.threadChannel){const e=s.data.response.ok?s.data.response.value.transfer:[];this.threadChannel.postMessageToWorkerThread(s.data.sourceTid,s,e)}else if("postMessageToMainThread"in this.threadChannel)throw new Error("unreachable")}};function Yt(s){return s instanceof Error?{isError:!0,value:{message:s.message,name:s.name,stack:s.stack}}:{isError:!1,value:s}}function _s(s){return s.isError?Object.assign(new Error(s.value.message),s.value):s.value}var ne;typeof globalThis<"u"?ne=globalThis:typeof window<"u"?ne=window:typeof global<"u"?ne=global:typeof self<"u"&&(ne=self);var us=class{constructor(){this._heapValueById=new Map,this._heapValueById.set(1,ne),this._heapEntryByValue=new Map,this._heapEntryByValue.set(ne,{id:1,rc:1}),this._heapNextKey=2}retain(s){const e=this._heapEntryByValue.get(s);if(e)return e.rc++,e.id;const t=this._heapNextKey++;return this._heapValueById.set(t,s),this._heapEntryByValue.set(s,{id:t,rc:1}),t}retainByRef(s){return this.retain(this.getObject(s))}release(s){const e=this._heapValueById.get(s),t=this._heapEntryByValue.get(e);t.rc--,t.rc==0&&(this._heapEntryByValue.delete(e),this._heapValueById.delete(s))}getObject(s){const e=this._heapValueById.get(s);if(e===void 0)throw new ReferenceError("Attempted to read invalid reference "+s);return e}},ds=class{constructor(s){this.version=708,this.textDecoder=new TextDecoder("utf-8"),this.textEncoder=new TextEncoder,this.UnsafeEventLoopYield=Ie,this.importObjects=()=>this.wasmImports,this._instance=null,this.memory=new us,this._closureDeallocator=null,this.tid=null,this.options=s||{},this.getDataView=()=>{throw new Error("Please call setInstance() before using any JavaScriptKit APIs from Swift.")},this.getUint8Array=()=>{throw new Error("Please call setInstance() before using any JavaScriptKit APIs from Swift.")},this.wasmMemory=null}setInstance(s){this._instance=s;const e=s.exports.memory;if(e instanceof WebAssembly.Memory){let t=new DataView(e.buffer),i=new Uint8Array(e.buffer);Object.getPrototypeOf(e.buffer).constructor.name==="SharedArrayBuffer"?(this.getDataView=()=>(t.buffer!==e.buffer&&(t=new DataView(e.buffer)),t),this.getUint8Array=()=>(i.buffer!==e.buffer&&(i=new Uint8Array(e.buffer)),i)):(this.getDataView=()=>(t.buffer.byteLength===0&&(t=new DataView(e.buffer)),t),this.getUint8Array=()=>(i.byteLength===0&&(i=new Uint8Array(e.buffer)),i)),this.wasmMemory=e}else throw new Error("instance.exports.memory is not a WebAssembly.Memory!?");if(typeof this.exports._start=="function")throw new Error(`JavaScriptKit supports only WASI reactor ABI.
                Please make sure you are building with:
                -Xswiftc -Xclang-linker -Xswiftc -mexec-model=reactor
                `);if(this.exports.swjs_library_version()!=this.version)throw new Error(`The versions of JavaScriptKit are incompatible.
                WebAssembly runtime ${this.exports.swjs_library_version()} != JS runtime ${this.version}`)}main(){const s=this.instance;try{typeof s.exports.main=="function"?s.exports.main():typeof s.exports.__main_argc_argv=="function"&&s.exports.__main_argc_argv(0,0)}catch(e){if(e instanceof Ie)return;throw e}}startThread(s,e){this.tid=s;const t=this.instance;try{if(typeof t.exports.wasi_thread_start=="function")t.exports.wasi_thread_start(s,e);else throw new Error("The WebAssembly module is not built for wasm32-unknown-wasip1-threads target.")}catch(i){if(i instanceof Ie)return;throw i}}get instance(){if(!this._instance)throw new Error("WebAssembly instance is not set yet");return this._instance}get exports(){return this.instance.exports}get closureDeallocator(){return this._closureDeallocator?this._closureDeallocator:((this.exports.swjs_library_features()&1)!=0&&(this._closureDeallocator=new os(this.exports)),this._closureDeallocator)}callHostFunction(s,e,t,i){const a=i.length,r=this.exports.swjs_prepare_host_function_call(a),n=this.memory,o=this.getDataView();for(let d=0;d<i.length;d++){const h=i[d],C=r+16*d;$e(h,C,C+4,C+8,!1,o,n)}let c;const _=n.retain(d=>{c=d});if(this.exports.swjs_call_host_function(s,r,a,_))throw new Error(`The JSClosure has been already released by Swift side. The closure is created at ${t}:${e} @${s}`);return this.exports.swjs_cleanup_host_function_call(r),c}get wasmImports(){let s=null;const e=t=>{var i;if(s)return s;const a=new cs(this.memory),r=new ls((i=this.tid)!==null&&i!==void 0?i:-1,t,{onRequest:n=>{let o;try{o={ok:!0,value:a[n.data.request.method](...n.data.request.parameters)}}catch(_){o={ok:!1,error:Yt(_)}}const c={type:"response",data:{sourceTid:n.data.sourceTid,context:n.data.context,response:o}};try{r.reply(c)}catch(_){c.data.response={ok:!1,error:Yt(new TypeError(`Failed to serialize message: ${_}`))},r.reply(c)}},onResponse:n=>{if(n.data.response.ok){const o=this.memory.retain(n.data.response.value.object);this.exports.swjs_receive_response(o,n.data.context)}else{const o=_s(n.data.response.error),c=this.memory.retain(o);this.exports.swjs_receive_error(c,n.data.context)}}});return s=r,r};return{swjs_set_prop:(t,i,a,r,n)=>{const o=this.memory,c=o.getObject(t),_=o.getObject(i),u=at(a,r,n,o);c[_]=u},swjs_get_prop:(t,i,a,r)=>{const n=this.memory,o=n.getObject(t),c=n.getObject(i),_=o[c];return Q(_,a,r,!1,this.getDataView(),this.memory)},swjs_set_subscript:(t,i,a,r,n)=>{const o=this.memory,c=o.getObject(t),_=at(a,r,n,o);c[i]=_},swjs_get_subscript:(t,i,a,r)=>{const o=this.memory.getObject(t)[i];return Q(o,a,r,!1,this.getDataView(),this.memory)},swjs_encode_string:(t,i)=>{const a=this.memory,r=this.textEncoder.encode(a.getObject(t)),n=a.retain(r);return this.getDataView().setUint32(i,n,!0),r.length},swjs_decode_string:this.options.sharedMemory==!0?((t,i)=>{const a=this.getUint8Array().slice(t,t+i),r=this.textDecoder.decode(a);return this.memory.retain(r)}):((t,i)=>{const a=this.getUint8Array().subarray(t,t+i),r=this.textDecoder.decode(a);return this.memory.retain(r)}),swjs_load_string:(t,i)=>{const a=this.memory.getObject(t);this.getUint8Array().set(a,i)},swjs_call_function:(t,i,a,r,n)=>{const o=this.memory,c=o.getObject(t);let _;try{const u=se(i,a,this.getDataView(),o);_=c(...u)}catch(u){return Q(u,r,n,!0,this.getDataView(),this.memory)}return Q(_,r,n,!1,this.getDataView(),this.memory)},swjs_call_function_no_catch:(t,i,a,r,n)=>{const o=this.memory,c=o.getObject(t),_=se(i,a,this.getDataView(),o),u=c(..._);return Q(u,r,n,!1,this.getDataView(),this.memory)},swjs_call_function_with_this:(t,i,a,r,n,o)=>{const c=this.memory,_=c.getObject(t),u=c.getObject(i);let d;try{const h=se(a,r,this.getDataView(),c);d=u.apply(_,h)}catch(h){return Q(h,n,o,!0,this.getDataView(),this.memory)}return Q(d,n,o,!1,this.getDataView(),this.memory)},swjs_call_function_with_this_no_catch:(t,i,a,r,n,o)=>{const c=this.memory,_=c.getObject(t),u=c.getObject(i);let d;const h=se(a,r,this.getDataView(),c);return d=u.apply(_,h),Q(d,n,o,!1,this.getDataView(),this.memory)},swjs_call_new:(t,i,a)=>{const r=this.memory,n=r.getObject(t),o=se(i,a,this.getDataView(),r),c=new n(...o);return this.memory.retain(c)},swjs_call_throwing_new:(t,i,a,r,n,o)=>{let c=this.memory;const _=c.getObject(t);let u;try{const d=se(i,a,this.getDataView(),c);u=new _(...d)}catch(d){return $e(d,r,n,o,!0,this.getDataView(),this.memory),-1}return c=this.memory,$e(null,r,n,o,!1,this.getDataView(),c),c.retain(u)},swjs_instanceof:(t,i)=>{const a=this.memory,r=a.getObject(t),n=a.getObject(i);return r instanceof n},swjs_value_equals:(t,i)=>{const a=this.memory,r=a.getObject(t),n=a.getObject(i);return r==n},swjs_create_function:(t,i,a)=>{var r;const n=this.memory.getObject(a),o=(..._)=>this.callHostFunction(t,i,n,_),c=this.memory.retain(o);return(r=this.closureDeallocator)===null||r===void 0||r.track(o,t),c},swjs_create_oneshot_function:(t,i,a)=>{const r=this.memory.getObject(a),n=(...c)=>this.callHostFunction(t,i,r,c);return this.memory.retain(n)},swjs_create_typed_array:(t,i,a)=>{const r=this.memory.getObject(t);if(a==0)return this.memory.retain(new r);const n=new r(this.wasmMemory.buffer,i,a);return this.memory.retain(n.slice())},swjs_create_object:()=>this.memory.retain({}),swjs_load_typed_array:(t,i)=>{const r=this.memory.getObject(t),n=new Uint8Array(r.buffer);this.getUint8Array().set(n,i)},swjs_release:t=>{this.memory.release(t)},swjs_release_remote:(t,i)=>{var a;if(!this.options.threadChannel)throw new Error("threadChannel is not set in options given to SwiftRuntime. Please set it to release objects on remote threads.");e(this.options.threadChannel).request({type:"request",data:{sourceTid:(a=this.tid)!==null&&a!==void 0?a:Xe,targetTid:t,context:0,request:{method:"release",parameters:[i]}}})},swjs_i64_to_bigint:(t,i)=>this.memory.retain(i?t:BigInt.asUintN(64,t)),swjs_bigint_to_i64:(t,i)=>{const a=this.memory.getObject(t);if(typeof a!="bigint")throw new Error(`Expected a BigInt, but got ${typeof a}`);return i?a:a<BigInt(0)?BigInt(0):BigInt.asIntN(64,a)},swjs_i64_to_bigint_slow:(t,i,a)=>{const r=BigInt.asUintN(32,BigInt(t))+(BigInt.asUintN(32,BigInt(i))<<BigInt(32));return this.memory.retain(a?BigInt.asIntN(64,r):BigInt.asUintN(64,r))},swjs_unsafe_event_loop_yield:()=>{throw new Ie},swjs_send_job_to_main_thread:t=>{this.postMessageToMainThread({type:"job",data:t})},swjs_listen_message_from_main_thread:()=>{const t=this.options.threadChannel;if(!(t&&"listenMessageFromMainThread"in t))throw new Error("listenMessageFromMainThread is not set in options given to SwiftRuntime. Please set it to listen to wake events from the main thread.");const i=e(t);t.listenMessageFromMainThread(a=>{switch(a.type){case"wake":this.exports.swjs_wake_worker_thread();break;case"request":{i.onReceivingRequest(a);break}case"response":{i.onReceivingResponse(a);break}default:const r=a;throw new Error(`Unknown message type: ${r}`)}})},swjs_wake_up_worker_thread:t=>{this.postMessageToWorkerThread(t,{type:"wake"})},swjs_listen_message_from_worker_thread:t=>{const i=this.options.threadChannel;if(!(i&&"listenMessageFromWorkerThread"in i))throw new Error("listenMessageFromWorkerThread is not set in options given to SwiftRuntime. Please set it to listen to jobs from worker threads.");const a=e(i);i.listenMessageFromWorkerThread(t,r=>{switch(r.type){case"job":this.exports.swjs_enqueue_main_job_from_worker(r.data);break;case"request":{a.onReceivingRequest(r);break}case"response":{a.onReceivingResponse(r);break}default:const n=r;throw new Error(`Unknown message type: ${n}`)}})},swjs_terminate_worker_thread:t=>{var i;const a=this.options.threadChannel;a&&"terminateWorkerThread"in a&&((i=a.terminateWorkerThread)===null||i===void 0||i.call(a,t))},swjs_get_worker_thread_id:()=>this.tid||-1,swjs_request_sending_object:(t,i,a,r,n)=>{var o;if(!this.options.threadChannel)throw new Error("threadChannel is not set in options given to SwiftRuntime. Please set it to request transferring objects.");const c=e(this.options.threadChannel),_=Qe(i,a,this.getDataView());c.request({type:"request",data:{sourceTid:(o=this.tid)!==null&&o!==void 0?o:Xe,targetTid:r,context:n,request:{method:"send",parameters:[t,_,n]}}})},swjs_request_sending_objects:(t,i,a,r,n,o)=>{var c;if(!this.options.threadChannel)throw new Error("threadChannel is not set in options given to SwiftRuntime. Please set it to request transferring objects.");const _=e(this.options.threadChannel),u=this.getDataView(),d=Qe(t,i,u),h=Qe(a,r,u);_.request({type:"request",data:{sourceTid:(c=this.tid)!==null&&c!==void 0?c:Xe,targetTid:n,context:o,request:{method:"sendObjects",parameters:[d,h,o]}}})}}}postMessageToMainThread(s,e=[]){const t=this.options.threadChannel;if(!(t&&"postMessageToMainThread"in t))throw new Error("postMessageToMainThread is not set in options given to SwiftRuntime. Please set it to send messages to the main thread.");t.postMessageToMainThread(s,e)}postMessageToWorkerThread(s,e,t=[]){const i=this.options.threadChannel;if(!(i&&"postMessageToWorkerThread"in i))throw new Error("postMessageToWorkerThread is not set in options given to SwiftRuntime. Please set it to send messages to worker threads.");i.postMessageToWorkerThread(s,e,t)}},Ie=class extends Error{};async function ms(s,e){let t,i;const a=new TextDecoder("utf-8"),r=new TextEncoder("utf-8");let n,o,c=[],_=[],u=[];return{addImports:(d,h)=>{const C={};d.bjs=C,s.getImports(h),C.swift_js_return_string=function(m,p){const S=new Uint8Array(i.buffer,m,p);n=a.decode(S)},C.swift_js_init_memory=function(m,p){const S=e.memory.getObject(m);new Uint8Array(i.buffer,p).set(S)},C.swift_js_make_js_string=function(m,p){const S=new Uint8Array(i.buffer,m,p);return e.memory.retain(a.decode(S))},C.swift_js_init_memory_with_result=function(m,p){new Uint8Array(i.buffer,m,p).set(o),o=void 0},C.swift_js_throw=function(m){e.memory.retainByRef(m)},C.swift_js_retain=function(m){return e.memory.retainByRef(m)},C.swift_js_release=function(m){e.memory.release(m)},C.swift_js_push_tag=function(m){},C.swift_js_push_int=function(m){},C.swift_js_push_f32=function(m){},C.swift_js_push_f64=function(m){},C.swift_js_push_string=function(m,p){const S=new Uint8Array(i.buffer,m,p);a.decode(S)},C.swift_js_pop_param_int32=function(){return c.pop()},C.swift_js_pop_param_f32=function(){return _.pop()},C.swift_js_pop_param_f64=function(){return u.pop()},C.swift_js_return_optional_bool=function(m,p){},C.swift_js_return_optional_int=function(m,p){},C.swift_js_return_optional_float=function(m,p){},C.swift_js_return_optional_double=function(m,p){},C.swift_js_return_optional_string=function(m,p,S){if(m===0)n=null;else{const F=new Uint8Array(i.buffer,p,S);n=a.decode(F)}},C.swift_js_return_optional_object=function(m,p){m===0?n=null:n=e.memory.getObject(p)},C.swift_js_return_optional_heap_object=function(m,p){}},setInstance:d=>{t=d,i=t.exports.memory},createExports:d=>(e.memory.heap,{demangle:function(C){const m=r.encode(C),p=e.memory.retain(m);d.exports.bjs_demangle(p,m.length);const S=n;return n=void 0,e.memory.release(p),S}})}}async function ps(s){const e=await fs(s);return s.wasi.initialize(e.instance),e.swift.main(),e}async function fs(s){const e=s.WebAssembly||WebAssembly,t=s.module,{wasi:i}=s,a=new ds({}),r=await ms(s,a),n={javascript_kit:a.wasmImports,wasi_snapshot_preview1:i.wasiImport},o={getInstance:()=>_,getExports:()=>u,_swift:a};r.addImports(n,o),s.addToCoreImports?.(n,o);let c,_,u;if(t instanceof e.Module)c=t,_=await e.instantiate(c,n);else if(typeof Response=="function"&&(t instanceof Response||t instanceof Promise))if(typeof e.instantiateStreaming=="function"){const d=await e.instantiateStreaming(t,n);c=d.module,_=d.instance}else{const d=await(await t).arrayBuffer();c=await e.compile(d),_=await e.instantiate(c,n)}else c=await e.compile(t),_=await e.instantiate(c,n);return _=s.instrumentInstance?.(_,{_swift:a})??_,a.setInstance(_),r.setInstance(_),u=r.createExports(_),{instance:_,swift:a,exports:u}}async function Cs(s={}){let e;s.module?e=s.module:e=fetch(new URL(""+new URL("swift-demangle-CK-UlFnF.wasm",import.meta.url).href,import.meta.url));const t=new ns([],[],[],{debug:!1}),{exports:{demangle:i}}=await ps({module:e,getImports(){return{}},wasi:Object.assign(t,{setInstance(a){t.inst=a}})});return i}async function hs(s={}){var e;(function(){function l(W){W=W.split("-")[0];for(var ee=W.split(".").slice(0,3);ee.length<3;)ee.push("00");return ee=ee.map((_r,Bs,Gs)=>_r.padStart(2,"0")),ee.join("")}var f=W=>[W/1e4|0,(W/100|0)%100,W%100].join("."),w=2147483647,T=typeof process<"u"&&process.versions?.node?l(process.versions.node):w;if(T<24e4)throw new Error(`This emscripten-generated code requires node v${f(24e4)} (detected v${f(T)})`);var D=typeof navigator<"u"&&navigator.userAgent;if(D){var z=D.includes("Safari/")&&!D.includes("Chrome/")&&D.match(/Version\/(\d+\.?\d*\.?\d*)/)?l(D.match(/Version\/(\d+\.?\d*\.?\d*)/)[1]):w;if(z<180400)throw new Error(`This emscripten-generated code requires Safari v${f(180400)} (detected v${z})`);var G=D.match(/Firefox\/(\d+(?:\.\d+)?)/)?parseFloat(D.match(/Firefox\/(\d+(?:\.\d+)?)/)[1]):w;if(G<131)throw new Error(`This emscripten-generated code requires Firefox v131 (detected v${G})`);var X=D.match(/Chrome\/(\d+(?:\.\d+)?)/)?parseFloat(D.match(/Chrome\/(\d+(?:\.\d+)?)/)[1]):w;if(X<137)throw new Error(`This emscripten-generated code requires Chrome v137 (detected v${X})`)}})();var t=s,i=!!globalThis.window,a=!!globalThis.WorkerGlobalScope,r=globalThis.process?.versions?.node&&globalThis.process?.type!="renderer",n=!i&&!r&&!a;if(r){const{createRequire:l}=await import("./worker-g4gPNqLC.js").then(function(f){return f._});var o=l(import.meta.url)}var c=(l,f)=>{throw f},_=import.meta.url,u="";function d(l){return t.locateFile?t.locateFile(l,u):u+l}var h,C;if(r){if(!(globalThis.process?.versions?.node&&globalThis.process?.type!="renderer"))throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");var m=o("fs");_.startsWith("file:")&&(u=o("path").dirname(o("url").fileURLToPath(_))+"/"),C=f=>{f=P(f)?new URL(f):f;var w=m.readFileSync(f);return I(Buffer.isBuffer(w)),w},h=async(f,w=!0)=>{f=P(f)?new URL(f):f;var T=m.readFileSync(f,w?void 0:"utf8");return I(w?Buffer.isBuffer(T):typeof T=="string"),T},process.argv.length>1&&process.argv[1].replace(/\\/g,"/"),process.argv.slice(2),c=(f,w)=>{throw process.exitCode=f,w}}else if(!n)if(i||a){try{u=new URL(".",_).href}catch{}if(!(globalThis.window||globalThis.WorkerGlobalScope))throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");a&&(C=l=>{var f=new XMLHttpRequest;return f.open("GET",l,!1),f.responseType="arraybuffer",f.send(null),new Uint8Array(f.response)}),h=async l=>{I(!P(l),"readAsync does not work with file:// URLs");var f=await fetch(l,{credentials:"same-origin"});if(f.ok)return f.arrayBuffer();throw new Error(f.status+" : "+f.url)}}else throw new Error("environment detection error");var p=console.log.bind(console),S=console.error.bind(console);I(!n,"shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.");var F;globalThis.WebAssembly||S("no native wasm support detected");var y=!1,k;function I(l,f){l||B("Assertion failed"+(f?": "+f:""))}var P=l=>l.startsWith("file://");function J(){var l=ue();I((l&3)==0),l==0&&(l+=4),j[l>>>2>>>0]=34821223,j[l+4>>>2>>>0]=2310721022,j[0]=1668509029}function Y(){if(!y){var l=ue();l==0&&(l+=4);var f=j[l>>>2>>>0],w=j[l+4>>>2>>>0];(f!=34821223||w!=2310721022)&&B(`Stack overflow! Stack cookie has been overwritten at ${re(l)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${re(w)} ${re(f)}`),j[0]!=1668509029&&B("Runtime error: The application has corrupted its heap memory area (address zero)!")}}(()=>{var l=new Int16Array(1),f=new Int8Array(l.buffer);l[0]=25459,(f[0]!==115||f[1]!==99)&&B("Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)")})();function Ce(l){Object.getOwnPropertyDescriptor(t,l)||Object.defineProperty(t,l,{configurable:!0,set(){B(`Attempt to set \`Module.${l}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`)}})}function M(l){return()=>I(!1,`call to '${l}' via reference taken before Wasm module initialization`)}function fi(l){Object.getOwnPropertyDescriptor(t,l)&&B(`\`Module.${l}\` was supplied but \`${l}\` not included in INCOMING_MODULE_JS_API`)}function Ci(l){return l==="FS_createPath"||l==="FS_createDataFile"||l==="FS_createPreloadedFile"||l==="FS_preloadFile"||l==="FS_unlink"||l==="addRunDependency"||l==="FS_createLazyFile"||l==="FS_createDevice"||l==="removeRunDependency"}function hi(l){ct(l)}function ct(l){Object.getOwnPropertyDescriptor(t,l)||Object.defineProperty(t,l,{configurable:!0,get(){var f=`'${l}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;Ci(l)&&(f+=". Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you"),B(f)}})}var lt,Pe,oe,j,ce=!1;function _t(){var l=he.buffer;new Int8Array(l),new Int16Array(l),t.HEAPU8=oe=new Uint8Array(l),new Uint16Array(l),new Int32Array(l),j=new Uint32Array(l),new Float32Array(l),new Float64Array(l),new BigInt64Array(l),new BigUint64Array(l)}I(globalThis.Int32Array&&globalThis.Float64Array&&Int32Array.prototype.subarray&&Int32Array.prototype.set,"JS engine does not provide full typed array support");function Si(){if(t.preRun)for(typeof t.preRun=="function"&&(t.preRun=[t.preRun]);t.preRun.length;)vi(t.preRun.shift());Ce("preRun"),dt(pt)}function gi(){I(!ce),ce=!0,Di(),Y(),Z.__wasm_call_ctors()}function Ei(){if(Y(),t.postRun)for(typeof t.postRun=="function"&&(t.postRun=[t.postRun]);t.postRun.length;)Ni(t.postRun.shift());Ce("postRun"),dt(mt)}function B(l){t.onAbort?.(l),l="Aborted("+l+")",S(l),y=!0,ce&&At();var f=new WebAssembly.RuntimeError(l);throw Pe?.(f),f}var q={error(){B("Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with -sFORCE_FILESYSTEM")},init(){q.error()},createDataFile(){q.error()},createPreloadedFile(){q.error()},createLazyFile(){q.error()},open(){q.error()},mkdev(){q.error()},registerDevice(){q.error()},analyzePath(){q.error()},ErrnoError(){q.error()}};function K(l,f){return(...w)=>{I(ce,`native function \`${l}\` called before runtime initialization`);var T=Z[l];return I(T,`exported native function \`${l}\` not found`),I(w.length<=f,`native function \`${l}\` called with ${w.length} args but expects ${f}`),T(...w)}}var ke;function Fi(){return t.locateFile?d("llvm-msvc-demangle.wasm"):new URL(""+new URL("llvm-msvc-demangle-BEQYC2Hu.wasm",import.meta.url).href,import.meta.url).href}function Ri(l){if(l==ke&&F)return new Uint8Array(F);if(C)return C(l);throw"both async and sync fetching of the wasm failed"}async function Ii(l){if(!F)try{var f=await h(l);return new Uint8Array(f)}catch{}return Ri(l)}async function Ai(l,f){try{var w=await Ii(l),T=await WebAssembly.instantiate(w,f);return T}catch(D){S(`failed to asynchronously prepare wasm: ${D}`),P(l)&&S(`warning: Loading from a file URI (${l}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`),B(D)}}async function wi(l,f,w){if(!l&&!r)try{var T=fetch(f,{credentials:"same-origin"}),D=await WebAssembly.instantiateStreaming(T,w);return D}catch(z){S(`wasm streaming compile failed: ${z}`),S("falling back to ArrayBuffer instantiation")}return Ai(f,w)}function Ti(){var l={env:Pt,wasi_snapshot_preview1:Pt};return l}async function yi(){function l(G,X){return Z=G.exports,Z=nr(Z),sr(Z),_t(),Z}var f=t;function w(G){return I(t===f,"the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?"),f=null,l(G.instance)}var T=Ti();if(t.instantiateWasm)return new Promise((G,X)=>{try{t.instantiateWasm(T,(W,ee)=>{G(l(W,ee))})}catch(W){S(`Module.instantiateWasm callback failed with error: ${W}`),X(W)}});ke??=Fi();var D=await wi(F,ke,T),z=w(D);return z}class ut{name="ExitStatus";constructor(f){this.message=`Program terminated with exit(${f})`,this.status=f}}var dt=l=>{for(;l.length>0;)l.shift()(t)},mt=[],Ni=l=>mt.push(l),pt=[],vi=l=>pt.push(l),Me=!0,re=l=>(I(typeof l=="number",`ptrToString expects a number, got ${typeof l}`),l>>>=0,"0x"+l.toString(16).padStart(8,"0")),Di=()=>{var l=Ge(),f=ue();bt(l,f)},le=l=>{le.shown||={},le.shown[l]||(le.shown[l]=1,r&&(l="warning: "+l),S(l))},ft=new TextDecoder,Ct=(l,f,w,T)=>{for(var D=f+w;l[f]&&!(f>=D);)++f;return f},_e=(l,f,w)=>{if(I(typeof l=="number",`UTF8ToString expects a number (got ${typeof l})`),l>>>=0,!l)return"";var T=Ct(oe,l,f);return ft.decode(oe.subarray(l>>>0,T>>>0))};function Li(l,f,w,T){return l>>>=0,f>>>=0,T>>>=0,B(`Assertion failed: ${_e(l)}, at: `+[f?_e(f):"unknown filename",w,T?_e(T):"unknown function"])}function bi(l){l>>>=0;var f=Ge(),w=ue();B(`stack overflow (Attempt to set SP to ${re(l)}, with stack limits [${re(w)} - ${re(f)}]). If you require more stack space build with -sSTACK_SIZE=<bytes>`)}var ht=()=>Ot,xe=l=>{var f=l.getArg(ht(),0);return Dt(f)},Oi=()=>Ve(),Pi=l=>Tt(l),St=l=>yt(l),ki=l=>{var f=Oi(),w=St(4),T=St(4);Lt(l,w,T);var D=j[w>>>2>>>0],z=j[T>>>2>>>0],G=_e(D);Be(D);var X;return z&&(X=_e(z),Be(z)),Pi(f),[G,X]},gt=l=>{var f=xe(l);return ki(f)},Mi=l=>{var f=new WebAssembly.Exception(ht(),[l],{traceStack:!0});throw f.message=gt(f),f},xi=()=>B("native code called abort()"),He=0,Hi=()=>{Me=!1,He=0},ae={},Et=l=>{if(l instanceof ut||l=="unwind")return k;Y(),l instanceof WebAssembly.RuntimeError&&Ve()<=0&&S("Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 1048576)"),c(1,l)},ze=()=>Me||He>0,Ft=l=>{k=l,ze()||(t.onExit?.(l),y=!0),c(l,new ut(l))},zi=(l,f)=>{if(k=l,lr(),ze()&&!f){var w=`program exited (with status: ${l}), but keepRuntimeAlive() is set (counter=${He}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;Pe?.(w),S(w)}Ft(l)},Wi=zi,Ui=()=>{if(!ze())try{Wi(k)}catch(l){Et(l)}},Bi=l=>{if(y){S("user callback triggered after runtime exited or application aborted.  Ignoring.");return}try{l(),Ui()}catch(f){Et(f)}},Gi=()=>performance.now(),Vi=(l,f)=>{if(ae[l]&&(clearTimeout(ae[l].id),delete ae[l]),!f)return 0;var w=setTimeout(()=>{I(l in ae),delete ae[l],Bi(()=>It(l,Gi()))},f);return ae[l]={id:w,timeout_ms:f},0},Ki=()=>4294901760,Yi=(l,f)=>(I(f,"alignment argument is required"),Math.ceil(l/f)*f),ji=l=>{var f=he.buffer.byteLength,w=(l-f+65535)/65536|0;try{return he.grow(w),_t(),1}catch(T){S(`growMemory: Attempted to grow heap from ${f} bytes to ${l} bytes, but got error: ${T}`)}};function qi(l){l>>>=0;var f=oe.length;I(l>f);var w=Ki();if(l>w)return S(`Cannot enlarge memory, requested ${l} bytes, but the limit is ${w} bytes!`),!1;for(var T=1;T<=4;T*=2){var D=f*(1+.2/T);D=Math.min(D,l+100663296);var z=Math.min(w,Yi(Math.max(l,D),65536)),G=ji(z);if(G)return!0}return S(`Failed to grow the heap from ${f} bytes to ${z} bytes, not enough memory!`),!1}var Xi=l=>{B("fd_close called without SYSCALLS_REQUIRE_FILESYSTEM")};function $i(l,f,w,T){return 70}var We=[null,[],[]],Qi=(l,f=0,w,T)=>{f>>>=0;var D=Ct(l,f,w);return ft.decode(l.buffer?l.subarray(f,D):new Uint8Array(l.slice(f,D)))},Ue=(l,f)=>{var w=We[l];I(w),f===0||f===10?((l===1?p:S)(Qi(w)),w.length=0):w.push(f)},Zi=()=>{Rt(0),We[1].length&&Ue(1,10),We[2].length&&Ue(2,10)};function Ji(l,f,w,T){f>>>=0,w>>>=0,T>>>=0;for(var D=0,z=0;z<w;z++){var G=j[f>>>2>>>0],X=j[f+4>>>2>>>0];f+=8;for(var W=0;W<X;W++)Ue(l,oe[G+W>>>0]);D+=X}return j[T>>>2>>>0]=D,0}var er=l=>{var f=xe(l);vt(f)},tr=l=>{var f=xe(l);Nt(f)};{if(t.noExitRuntime&&(Me=t.noExitRuntime),t.print&&(p=t.print),t.printErr&&(S=t.printErr),t.wasmBinary&&(F=t.wasmBinary),t.FS_createDataFile=q.createDataFile,t.FS_createPreloadedFile=q.createPreloadedFile,ar(),t.arguments&&t.arguments,t.thisProgram&&t.thisProgram,I(typeof t.memoryInitializerPrefixURL>"u","Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead"),I(typeof t.pthreadMainPrefixURL>"u","Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead"),I(typeof t.cdInitializerPrefixURL>"u","Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead"),I(typeof t.filePackagePrefixURL>"u","Module.filePackagePrefixURL option was removed, use Module.locateFile instead"),I(typeof t.read>"u","Module.read option was removed"),I(typeof t.readAsync>"u","Module.readAsync option was removed (modify readAsync in JS)"),I(typeof t.readBinary>"u","Module.readBinary option was removed (modify readBinary in JS)"),I(typeof t.setWindowTitle>"u","Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)"),I(typeof t.TOTAL_MEMORY>"u","Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY"),I(typeof t.ENVIRONMENT>"u","Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)"),I(typeof t.STACK_SIZE>"u","STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time"),I(typeof t.wasmMemory>"u","Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally"),I(typeof t.INITIAL_MEMORY>"u","Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically"),t.preInit)for(typeof t.preInit=="function"&&(t.preInit=[t.preInit]);t.preInit.length>0;)t.preInit.shift()();Ce("preInit")}var ir=["writeI53ToI64","writeI53ToI64Clamped","writeI53ToI64Signaling","writeI53ToU64Clamped","writeI53ToU64Signaling","readI53FromI64","readI53FromU64","convertI32PairToI53","convertI32PairToI53Checked","convertU32PairToI53","getTempRet0","setTempRet0","createNamedFunction","zeroMemory","withStackSave","strError","inetPton4","inetNtop4","inetPton6","inetNtop6","readSockaddr","writeSockaddr","readEmAsmArgs","jstoi_q","getExecutableName","autoResumeAudioContext","getDynCaller","dynCall","setWasmTableEntry","getWasmTableEntry","runtimeKeepalivePush","runtimeKeepalivePop","asyncLoad","asmjsMangle","mmapAlloc","HandleAllocator","getUniqueRunDependency","addRunDependency","removeRunDependency","addOnInit","addOnPostCtor","addOnPreMain","addOnExit","STACK_SIZE","STACK_ALIGN","POINTER_SIZE","ASSERTIONS","ccall","cwrap","convertJsFunctionToWasm","getEmptyTableSlot","updateTableMap","getFunctionAddress","addFunction","removeFunction","stringToUTF8Array","stringToUTF8","lengthBytesUTF8","intArrayFromString","intArrayToString","AsciiToString","stringToAscii","UTF16ToString","stringToUTF16","lengthBytesUTF16","UTF32ToString","stringToUTF32","lengthBytesUTF32","stringToNewUTF8","stringToUTF8OnStack","writeArrayToMemory","registerKeyEventCallback","maybeCStringToJsString","findEventTarget","getBoundingClientRect","fillMouseEventData","registerMouseEventCallback","registerWheelEventCallback","registerUiEventCallback","registerFocusEventCallback","fillDeviceOrientationEventData","registerDeviceOrientationEventCallback","fillDeviceMotionEventData","registerDeviceMotionEventCallback","screenOrientation","fillOrientationChangeEventData","registerOrientationChangeEventCallback","fillFullscreenChangeEventData","registerFullscreenChangeEventCallback","JSEvents_requestFullscreen","JSEvents_resizeCanvasForFullscreen","registerRestoreOldStyle","hideEverythingExceptGivenElement","restoreHiddenElements","setLetterbox","softFullscreenResizeWebGLRenderTarget","doRequestFullscreen","fillPointerlockChangeEventData","registerPointerlockChangeEventCallback","registerPointerlockErrorEventCallback","requestPointerLock","fillVisibilityChangeEventData","registerVisibilityChangeEventCallback","registerTouchEventCallback","fillGamepadEventData","registerGamepadEventCallback","registerBeforeUnloadEventCallback","fillBatteryEventData","registerBatteryEventCallback","setCanvasElementSize","getCanvasElementSize","jsStackTrace","getCallstack","convertPCtoSourceLocation","getEnvStrings","checkWasiClock","wasiRightsToMuslOFlags","wasiOFlagsToMuslOFlags","initRandomFill","randomFill","safeSetTimeout","setImmediateWrapped","safeRequestAnimationFrame","clearImmediateWrapped","registerPostMainLoop","registerPreMainLoop","getPromise","makePromise","idsToPromises","makePromiseCallback","Browser_asyncPrepareDataCounter","isLeapYear","ydayFromDate","arraySum","addDays","getSocketFromFD","getSocketAddress","heapObjectForWebGLType","toTypedArrayIndex","webgl_enable_ANGLE_instanced_arrays","webgl_enable_OES_vertex_array_object","webgl_enable_WEBGL_draw_buffers","webgl_enable_WEBGL_multi_draw","webgl_enable_EXT_polygon_offset_clamp","webgl_enable_EXT_clip_control","webgl_enable_WEBGL_polygon_mode","emscriptenWebGLGet","computeUnpackAlignedImageSize","colorChannelsInGlTextureFormat","emscriptenWebGLGetTexPixelData","emscriptenWebGLGetUniform","webglGetUniformLocation","webglPrepareUniformLocationsBeforeFirstUse","webglGetLeftBracePos","emscriptenWebGLGetVertexAttrib","__glGetActiveAttribOrUniform","writeGLArray","registerWebGlEventCallback","runAndAbortIfError","ALLOC_NORMAL","ALLOC_STACK","allocate","writeStringToMemory","writeAsciiToMemory","allocateUTF8","allocateUTF8OnStack","demangle","stackTrace","getNativeTypeSize"];ir.forEach(hi);var rr=["run","out","err","callMain","abort","wasmExports","HEAPF32","HEAPF64","HEAP8","HEAP16","HEAPU16","HEAP32","HEAPU32","HEAP64","HEAPU64","writeStackCookie","checkStackCookie","INT53_MAX","INT53_MIN","bigintToI53Checked","stackSave","stackRestore","stackAlloc","ptrToString","exitJS","getHeapMax","growMemory","ENV","setStackLimits","ERRNO_CODES","DNS","Protocols","Sockets","timers","warnOnce","readEmAsmArgsArray","handleException","keepRuntimeAlive","callUserCallback","maybeExit","alignMemory","wasmTable","wasmMemory","noExitRuntime","addOnPreRun","addOnPostRun","freeTableIndexes","functionsInTableMap","setValue","getValue","PATH","PATH_FS","UTF8Decoder","UTF8ArrayToString","UTF8ToString","UTF16Decoder","JSEvents","specialHTMLTargets","findCanvasEventTarget","currentFullscreenStrategy","restoreOldWindowedStyle","UNWIND_CACHE","ExitStatus","flush_NO_FILESYSTEM","emSetImmediate","emClearImmediate_deps","emClearImmediate","promiseMap","getExceptionMessageCommon","getCppExceptionTag","getCppExceptionThrownObjectFromWebAssemblyException","Browser","requestFullscreen","requestFullScreen","setCanvasSize","getUserMedia","createContext","getPreloadedImageData__data","wget","MONTH_DAYS_REGULAR","MONTH_DAYS_LEAP","MONTH_DAYS_REGULAR_CUMULATIVE","MONTH_DAYS_LEAP_CUMULATIVE","SYSCALLS","tempFixedLengthArray","miniTempWebGLFloatBuffers","miniTempWebGLIntBuffers","GL","AL","GLUT","EGL","GLEW","IDBStore","SDL","SDL_gfx","print","printErr","jstoi_s"];rr.forEach(ct),t.getExceptionMessage=gt,t.incrementExceptionRefcount=er,t.decrementExceptionRefcount=tr;function ar(){fi("fetchSettings")}t._input_buffer=M("_input_buffer"),t._demangle=M("_demangle"),t._demangle_with_text=M("_demangle_with_text"),t._result_size=M("_result_size");var Be=M("_free");t.__ZNK4llvm16itanium_demangle4Node4dumpEv=M("__ZNK4llvm16itanium_demangle4Node4dumpEv");var Rt=M("_fflush"),ue=M("_emscripten_stack_get_end"),Ge=M("_emscripten_stack_get_base"),It=M("__emscripten_timeout"),At=M("___trap"),wt=M("_emscripten_stack_init"),Tt=M("__emscripten_stack_restore"),yt=M("__emscripten_stack_alloc"),Ve=M("_emscripten_stack_get_current"),Nt=M("___cxa_decrement_exception_refcount"),vt=M("___cxa_increment_exception_refcount"),Dt=M("___thrown_object_from_unwind_exception"),Lt=M("___get_exception_message"),bt=t.___set_stack_limits=M("___set_stack_limits"),Ot=M("___cpp_exception"),he=M("wasmMemory");function sr(l){I(typeof l.input_buffer<"u","missing Wasm export: input_buffer"),I(typeof l.demangle<"u","missing Wasm export: demangle"),I(typeof l.demangle_with_text<"u","missing Wasm export: demangle_with_text"),I(typeof l.result_size<"u","missing Wasm export: result_size"),I(typeof l.free<"u","missing Wasm export: free"),I(typeof l._ZNK4llvm16itanium_demangle4Node4dumpEv<"u","missing Wasm export: _ZNK4llvm16itanium_demangle4Node4dumpEv"),I(typeof l.fflush<"u","missing Wasm export: fflush"),I(typeof l.emscripten_stack_get_end<"u","missing Wasm export: emscripten_stack_get_end"),I(typeof l.emscripten_stack_get_base<"u","missing Wasm export: emscripten_stack_get_base"),I(typeof l._emscripten_timeout<"u","missing Wasm export: _emscripten_timeout"),I(typeof l.__trap<"u","missing Wasm export: __trap"),I(typeof l.emscripten_stack_init<"u","missing Wasm export: emscripten_stack_init"),I(typeof l.emscripten_stack_get_free<"u","missing Wasm export: emscripten_stack_get_free"),I(typeof l._emscripten_stack_restore<"u","missing Wasm export: _emscripten_stack_restore"),I(typeof l._emscripten_stack_alloc<"u","missing Wasm export: _emscripten_stack_alloc"),I(typeof l.emscripten_stack_get_current<"u","missing Wasm export: emscripten_stack_get_current"),I(typeof l.__cxa_decrement_exception_refcount<"u","missing Wasm export: __cxa_decrement_exception_refcount"),I(typeof l.__cxa_increment_exception_refcount<"u","missing Wasm export: __cxa_increment_exception_refcount"),I(typeof l.__thrown_object_from_unwind_exception<"u","missing Wasm export: __thrown_object_from_unwind_exception"),I(typeof l.__get_exception_message<"u","missing Wasm export: __get_exception_message"),I(typeof l.__set_stack_limits<"u","missing Wasm export: __set_stack_limits"),I(typeof l.memory<"u","missing Wasm export: memory"),I(typeof l.__indirect_function_table<"u","missing Wasm export: __indirect_function_table"),I(typeof l.__cpp_exception<"u","missing Wasm export: __cpp_exception"),t._input_buffer=K("input_buffer",1),t._demangle=K("demangle",2),t._demangle_with_text=K("demangle_with_text",2),t._result_size=K("result_size",0),Be=K("free",1),t.__ZNK4llvm16itanium_demangle4Node4dumpEv=K("_ZNK4llvm16itanium_demangle4Node4dumpEv",1),Rt=K("fflush",1),ue=l.emscripten_stack_get_end,Ge=l.emscripten_stack_get_base,It=K("_emscripten_timeout",2),At=l.__trap,wt=l.emscripten_stack_init,l.emscripten_stack_get_free,Tt=l._emscripten_stack_restore,yt=l._emscripten_stack_alloc,Ve=l.emscripten_stack_get_current,Nt=K("__cxa_decrement_exception_refcount",1),vt=K("__cxa_increment_exception_refcount",1),Dt=K("__thrown_object_from_unwind_exception",1),Lt=K("__get_exception_message",3),bt=t.___set_stack_limits=K("__set_stack_limits",2),he=l.memory,l.__indirect_function_table,Ot=l.__cpp_exception}var Pt={__assert_fail:Li,__handle_stack_overflow:bi,__throw_exception_with_stack_trace:Mi,_abort_js:xi,_emscripten_runtime_keepalive_clear:Hi,_setitimer_js:Vi,emscripten_resize_heap:qi,fd_close:Xi,fd_seek:$i,fd_write:Ji,proc_exit:Ft};function nr(l){l=Object.assign({},l);var f=T=>()=>T()>>>0,w=T=>D=>T(D)>>>0;return l.emscripten_stack_get_end=f(l.emscripten_stack_get_end),l.emscripten_stack_get_base=f(l.emscripten_stack_get_base),l._emscripten_stack_alloc=w(l._emscripten_stack_alloc),l.emscripten_stack_get_current=f(l.emscripten_stack_get_current),l}var kt;function or(){wt(),J()}function cr(){or(),Si();function l(){I(!kt),kt=!0,t.calledRun=!0,!y&&(gi(),lt?.(t),t.onRuntimeInitialized?.(),Ce("onRuntimeInitialized"),I(!t._main,'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]'),Ei())}t.setStatus?(t.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>t.setStatus(""),1),l()},1)):l(),Y()}function lr(){var l=p,f=S,w=!1;p=S=T=>{w=!0};try{Zi()}catch{}p=l,S=f,w&&(le("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc."),le("(this may also be due to not including full filesystem support - try building with -sFORCE_FILESYSTEM)"))}var Z;Z=await yi(),cr(),ce?e=t:e=new Promise((l,f)=>{lt=l,Pe=f});for(const l of Object.keys(t))l in s||Object.defineProperty(s,l,{configurable:!0,get(){B(`Access to module property ('${l}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`)}});return e}function Ss(s){if(typeof s!="string")return"Expected a string.";if(s.length===0)return"The mangled name is empty.";for(let e=0;e<s.length;++e)if(s.charCodeAt(e)<32||s.charCodeAt(e)>126)return"Expected printable ASCII without embedded NUL bytes.";return null}function Le(s,e){return{status:s,ast:null,consumed:0,warnings:[e]}}function jt(s,e,t){const i=s<0?s+4294967296:s,a=e<0?e+2**32:e;if(!Number.isInteger(i)||i<=0||!Number.isInteger(a)||a<=0||i>t.byteLength-a)throw new Error("WASM returned an invalid memory range.");return t.subarray(i,i+a)}function gs(s,e,t,i){const a=s._input_buffer(e.length);if(a===0)return Le("limit","Unable to allocate WASM input memory.");const r=jt(a,e.length+1,s.HEAPU8);for(let n=0;n<e.length;++n)r[n]=e.charCodeAt(n);return r[e.length]=0,JSON.parse(new TextDecoder("utf-8",{fatal:!0}).decode(jt(i(e.length,t),s._result_size(),s.HEAPU8)))}function Es(s){let e=!1;function t(i,a,r){const n=Ss(i);if(n)return Le("invalid",n);if(e)return Le("error","Create a new demangler after a fatal WASM failure.");try{return gs(s,i,a,r)}catch(o){return e=!0,Le("error",`WASM failure: ${o instanceof Error?o.message:String(o)}`)}}return Object.freeze({demangle:i=>t(i,0,s._demangle),demangleType:i=>t(i,1,s._demangle),demangleWithText:i=>({text:null,...t(i,0,s._demangle_with_text)}),demangleTypeWithText:i=>({text:null,...t(i,1,s._demangle_with_text)})})}async function qt(s){return Es(await hs({wasmBinary:s,printErr:()=>{}}))}async function Fs({wasmBinary:s,wasmURL:e}={}){if(s!==void 0)return qt(s);const t=await fetch(e??new URL(""+new URL("llvm-msvc-demangle-BEQYC2Hu.wasm",import.meta.url).href,import.meta.url));if(!t.ok)throw new Error(`Could not load LLVM WASM: HTTP ${t.status}`);return qt(new Uint8Array(await t.arrayBuffer()))}let Xt,$t,Qt;const Ze=new Map;let Zt=0;async function Rs(s,e,t){t.checkpoint(1);const i={original_name:s,display_name:null,language:null,status:"plain",diagnostics:[]},a=e==="macho"&&/^(?:__Z|_\$[sS]|__T|_\?)/.test(s)?s.slice(1):s,r=a.startsWith("_Z")?"c++-itanium":a.startsWith("?")?"c++-msvc":/^(?:\$[sS]|_T)/.test(a)?"swift":null;if(!r)return i;if(s.length>4096)return{...i,language:r,status:"limited",diagnostics:[{code:"resource_limit",severity:"warning",message:"Mangled name exceeds the display parser input bound",evidence_ids:[]}]};if(t.checkpoint(s.length),s.includes("\0"))return{...i,language:r,status:"unrecognized"};const n=`${e}:${s}`,o=Ze.get(n);if(o)return o;let c;try{r==="c++-itanium"?(Xt??=(async()=>{const C=new Uint8Array(await(await fetch(Ka)).arrayBuffer()),{instance:m}=await WebAssembly.instantiate(C,{"./index_bg.js":Za});return _i(m.exports),m.exports.__wbindgen_start(),di})(),c=await Xt):r==="swift"?($t??=Cs(),c=await $t):(Qt??=Fs(),c=await Qt)}catch{return t.checkpoint(0),{...i,language:r,status:"unavailable",diagnostics:[{code:"unavailable_semantics",severity:"warning",message:`Local ${r} display engine could not initialize`,evidence_ids:[]}]}}t.checkpoint(0);let _=null,u=!1;try{if(typeof c=="function")_=c(a);else{const C=c.demangleWithText(a);C.status==="success"&&C.consumed===a.length&&(_=C.text),u=C.status==="limit"}}catch{}t.checkpoint(0);const d=u||_&&_.length>8192?{...i,language:r,status:"limited",diagnostics:[{code:"resource_limit",severity:"warning",message:"Display parser resource or output bound reached",evidence_ids:[]}]}:_&&_!==a&&_!==a.slice(1)?{...i,language:r,status:"demangled",display_name:_}:{...i,language:r,status:"unrecognized"},h=n.length+s.length+(d.display_name?.length??0);return Ze.size<1024&&Zt+h<=1048576&&(Ze.set(n,d),Zt+=h),d}async function en(s,e){const t=[];let i="complete";async function a(c){const _=[];for(const u of c){if(e.checkpoint(1),u.original_name===null){_.push(u);continue}const d=await Rs(u.original_name,s.target.format,e);(d.status==="limited"||d.status==="unavailable")&&(i="partial");for(const h of d.diagnostics)t.length<256&&t.push({...h,entity_id:u.id});_.push((u.display_name===null||u.display_name===u.original_name)&&d.display_name!==null?{...u,display_name:d.display_name}:u)}return _}const r=await a(s.symbols),n=await a(s.imports),o=await a(s.exports);return{symbols:r,imports:n,exports:o,state:i,diagnostics:t}}const O=(...s)=>({kind:"values",names:s}),b=(s,e)=>({kind:"flags",names:s,...e?{fields:e}:{}}),Is=O("SIGHUP","SIGINT","SIGQUIT","SIGILL","SIGTRAP","SIGABRT","SIGBUS","SIGFPE","SIGKILL","SIGUSR1","SIGSEGV","SIGUSR2","SIGPIPE","SIGALRM","SIGTERM","SIGSTKFLT","SIGCHLD","SIGCONT","SIGSTOP","SIGTSTP","SIGTTIN","SIGTTOU","SIGURG","SIGXCPU","SIGXFSZ","SIGVTALRM","SIGPROF","SIGWINCH","SIGIO","SIGPWR","SIGSYS","SIGEMT","SIGINFO","SIGBREAK"),tn={open_flags:b(["O_CREAT","O_EXCL","O_NOCTTY","O_TRUNC","O_APPEND","O_NONBLOCK","O_SYNC","O_DSYNC","O_DIRECTORY","O_NOFOLLOW","O_CLOEXEC","O_DIRECT","O_NOATIME","O_PATH","O_TMPFILE","O_ASYNC","O_SHLOCK","O_EXLOCK","O_EVTONLY","O_SYMLINK","O_BINARY","O_TEXT","O_NOINHERIT","O_TEMPORARY","O_SEQUENTIAL","O_RANDOM"],[{mask:"O_ACCMODE",names:["O_RDONLY","O_WRONLY","O_RDWR"]}]),file_mode:{kind:"octal",names:[]},access_mode:b(["F_OK","R_OK","W_OK","X_OK"]),whence:O("SEEK_SET","SEEK_CUR","SEEK_END","SEEK_DATA","SEEK_HOLE"),fcntl_command:O("F_DUPFD","F_GETFD","F_SETFD","F_GETFL","F_SETFL","F_GETLK","F_SETLK","F_SETLKW","F_GETOWN","F_SETOWN","F_DUPFD_CLOEXEC","F_GETPATH","F_FULLFSYNC","F_NOCACHE","F_SETPIPE_SZ","F_GETPIPE_SZ"),protection:b(["PROT_NONE","PROT_READ","PROT_WRITE","PROT_EXEC"]),map_flags:b(["MAP_FIXED","MAP_ANONYMOUS","MAP_ANON","MAP_NORESERVE","MAP_POPULATE","MAP_GROWSDOWN","MAP_STACK","MAP_HUGETLB","MAP_LOCKED","MAP_NONBLOCK","MAP_FIXED_NOREPLACE","MAP_JIT","MAP_NOCACHE","MAP_32BIT"],[{mask:"MAP_TYPE",names:["MAP_SHARED","MAP_PRIVATE","MAP_SHARED_VALIDATE"]}]),msync_flags:b(["MS_ASYNC","MS_SYNC","MS_INVALIDATE"]),madvise_advice:O("MADV_NORMAL","MADV_RANDOM","MADV_SEQUENTIAL","MADV_WILLNEED","MADV_DONTNEED","MADV_FREE","MADV_REMOVE","MADV_DONTFORK","MADV_DOFORK","MADV_HUGEPAGE","MADV_NOHUGEPAGE"),address_family:O("AF_UNSPEC","AF_UNIX","AF_INET","AF_INET6","AF_NETLINK","AF_PACKET","AF_ROUTE","AF_SYSTEM","AF_BLUETOOTH"),socket_type:b(["SOCK_NONBLOCK","SOCK_CLOEXEC"],[{mask:"0xf",names:["SOCK_STREAM","SOCK_DGRAM","SOCK_RAW","SOCK_RDM","SOCK_SEQPACKET"]}]),ip_protocol:O("IPPROTO_ICMP","IPPROTO_IGMP","IPPROTO_TCP","IPPROTO_UDP","IPPROTO_IPV6","IPPROTO_ICMPV6","IPPROTO_RAW","IPPROTO_SCTP"),socket_level:O("SOL_SOCKET","IPPROTO_IP","IPPROTO_TCP","IPPROTO_UDP","IPPROTO_IPV6"),message_flags:b(["MSG_OOB","MSG_PEEK","MSG_DONTROUTE","MSG_WAITALL","MSG_DONTWAIT","MSG_NOSIGNAL","MSG_TRUNC","MSG_CTRUNC","MSG_EOR","MSG_MORE","MSG_CMSG_CLOEXEC"]),shutdown_how:O("SHUT_RD","SHUT_WR","SHUT_RDWR","SD_RECEIVE","SD_SEND","SD_BOTH"),signal:Is,signal_handler:O("SIG_DFL","SIG_IGN","SIG_ERR"),sigmask_how:O("SIG_BLOCK","SIG_UNBLOCK","SIG_SETMASK"),wait_options:b(["WNOHANG","WUNTRACED","WCONTINUED","WEXITED","WSTOPPED","WNOWAIT"]),dlopen_mode:b(["RTLD_GLOBAL","RTLD_LOCAL","RTLD_NODELETE","RTLD_NOLOAD","RTLD_DEEPBIND","RTLD_FIRST"],[{mask:"RTLD_BINDING_MASK",names:["RTLD_LAZY","RTLD_NOW"]}]),dlsym_handle:O("RTLD_DEFAULT","RTLD_NEXT","RTLD_SELF","RTLD_MAIN_ONLY"),flock_operation:b(["LOCK_SH","LOCK_EX","LOCK_NB","LOCK_UN"]),clock_id:O("CLOCK_REALTIME","CLOCK_MONOTONIC","CLOCK_PROCESS_CPUTIME_ID","CLOCK_THREAD_CPUTIME_ID","CLOCK_MONOTONIC_RAW","CLOCK_REALTIME_COARSE","CLOCK_MONOTONIC_COARSE","CLOCK_BOOTTIME","CLOCK_UPTIME_RAW"),locale_category:O("LC_ALL","LC_COLLATE","LC_CTYPE","LC_MONETARY","LC_NUMERIC","LC_TIME","LC_MESSAGES"),rlimit_resource:O("RLIMIT_CPU","RLIMIT_FSIZE","RLIMIT_DATA","RLIMIT_STACK","RLIMIT_CORE","RLIMIT_RSS","RLIMIT_NPROC","RLIMIT_NOFILE","RLIMIT_MEMLOCK","RLIMIT_AS"),buffer_mode:O("_IOFBF","_IOLBF","_IONBF"),sysconf_name:O("_SC_ARG_MAX","_SC_CHILD_MAX","_SC_CLK_TCK","_SC_NGROUPS_MAX","_SC_OPEN_MAX","_SC_PAGESIZE","_SC_NPROCESSORS_CONF","_SC_NPROCESSORS_ONLN","_SC_PHYS_PAGES","_SC_LINE_MAX","_SC_HOST_NAME_MAX","_SC_GETPW_R_SIZE_MAX","_SC_GETGR_R_SIZE_MAX"),epoll_op:O("EPOLL_CTL_ADD","EPOLL_CTL_DEL","EPOLL_CTL_MOD"),cloexec_flags:b(["EPOLL_CLOEXEC","EFD_NONBLOCK","EFD_SEMAPHORE"]),mutex_type:O("PTHREAD_MUTEX_NORMAL","PTHREAD_MUTEX_RECURSIVE","PTHREAD_MUTEX_ERRORCHECK","PTHREAD_MUTEX_DEFAULT"),ptrace_request:O("PTRACE_TRACEME","PTRACE_PEEKTEXT","PTRACE_PEEKDATA","PTRACE_POKETEXT","PTRACE_POKEDATA","PTRACE_CONT","PTRACE_KILL","PTRACE_SINGLESTEP","PTRACE_GETREGS","PTRACE_SETREGS","PTRACE_ATTACH","PTRACE_DETACH","PTRACE_SYSCALL","PTRACE_SEIZE","PT_DENY_ATTACH","PT_TRACE_ME","PT_ATTACH","PT_DETACH","PT_CONTINUE"),prctl_option:O("PR_SET_PDEATHSIG","PR_GET_PDEATHSIG","PR_SET_DUMPABLE","PR_GET_DUMPABLE","PR_SET_NAME","PR_GET_NAME","PR_SET_SECCOMP","PR_SET_NO_NEW_PRIVS","PR_SET_PTRACER"),ioctl_request:O("TCGETS","TCSETS","TIOCGWINSZ","TIOCSWINSZ","TIOCSCTTY","TIOCGPGRP","TIOCSPGRP","FIONREAD","FIONBIO","FIOCLEX","FIONCLEX"),access_rights:b(["GENERIC_READ","GENERIC_WRITE","GENERIC_EXECUTE","GENERIC_ALL","MAXIMUM_ALLOWED","DELETE","READ_CONTROL","WRITE_DAC","WRITE_OWNER","SYNCHRONIZE","FILE_READ_DATA","FILE_WRITE_DATA","FILE_APPEND_DATA","FILE_READ_EA","FILE_WRITE_EA","FILE_EXECUTE","FILE_READ_ATTRIBUTES","FILE_WRITE_ATTRIBUTES"]),file_share:b(["FILE_SHARE_READ","FILE_SHARE_WRITE","FILE_SHARE_DELETE"]),creation_disposition:O("CREATE_NEW","CREATE_ALWAYS","OPEN_EXISTING","OPEN_ALWAYS","TRUNCATE_EXISTING"),file_attributes:b(["FILE_ATTRIBUTE_READONLY","FILE_ATTRIBUTE_HIDDEN","FILE_ATTRIBUTE_SYSTEM","FILE_ATTRIBUTE_DIRECTORY","FILE_ATTRIBUTE_ARCHIVE","FILE_ATTRIBUTE_DEVICE","FILE_ATTRIBUTE_NORMAL","FILE_ATTRIBUTE_TEMPORARY","FILE_ATTRIBUTE_SPARSE_FILE","FILE_ATTRIBUTE_REPARSE_POINT","FILE_ATTRIBUTE_COMPRESSED","FILE_ATTRIBUTE_OFFLINE","FILE_ATTRIBUTE_NOT_CONTENT_INDEXED","FILE_ATTRIBUTE_ENCRYPTED","FILE_FLAG_WRITE_THROUGH","FILE_FLAG_OVERLAPPED","FILE_FLAG_NO_BUFFERING","FILE_FLAG_RANDOM_ACCESS","FILE_FLAG_SEQUENTIAL_SCAN","FILE_FLAG_DELETE_ON_CLOSE","FILE_FLAG_BACKUP_SEMANTICS","FILE_FLAG_POSIX_SEMANTICS","FILE_FLAG_OPEN_REPARSE_POINT","FILE_FLAG_OPEN_NO_RECALL"]),allocation_type:b(["MEM_COMMIT","MEM_RESERVE","MEM_RESET","MEM_RESET_UNDO","MEM_TOP_DOWN","MEM_WRITE_WATCH","MEM_PHYSICAL","MEM_LARGE_PAGES"]),free_type:b(["MEM_DECOMMIT","MEM_RELEASE"]),page_protection:b(["PAGE_NOACCESS","PAGE_READONLY","PAGE_READWRITE","PAGE_WRITECOPY","PAGE_EXECUTE","PAGE_EXECUTE_READ","PAGE_EXECUTE_READWRITE","PAGE_EXECUTE_WRITECOPY","PAGE_GUARD","PAGE_NOCACHE","PAGE_WRITECOMBINE","SEC_IMAGE","SEC_RESERVE","SEC_COMMIT","SEC_NOCACHE"]),file_map_access:b(["FILE_MAP_ALL_ACCESS","FILE_MAP_READ","FILE_MAP_WRITE","FILE_MAP_COPY","FILE_MAP_EXECUTE"]),move_method:O("FILE_BEGIN","FILE_CURRENT","FILE_END"),process_access:b(["PROCESS_ALL_ACCESS","PROCESS_TERMINATE","PROCESS_CREATE_THREAD","PROCESS_VM_OPERATION","PROCESS_VM_READ","PROCESS_VM_WRITE","PROCESS_DUP_HANDLE","PROCESS_CREATE_PROCESS","PROCESS_SET_QUOTA","PROCESS_SET_INFORMATION","PROCESS_QUERY_INFORMATION","PROCESS_SUSPEND_RESUME","PROCESS_QUERY_LIMITED_INFORMATION","SYNCHRONIZE"]),thread_access:b(["THREAD_ALL_ACCESS","THREAD_TERMINATE","THREAD_SUSPEND_RESUME","THREAD_GET_CONTEXT","THREAD_SET_CONTEXT","THREAD_QUERY_INFORMATION","THREAD_SET_INFORMATION","SYNCHRONIZE"]),process_creation:b(["DEBUG_PROCESS","DEBUG_ONLY_THIS_PROCESS","CREATE_SUSPENDED","DETACHED_PROCESS","CREATE_NEW_CONSOLE","NORMAL_PRIORITY_CLASS","IDLE_PRIORITY_CLASS","HIGH_PRIORITY_CLASS","REALTIME_PRIORITY_CLASS","CREATE_NEW_PROCESS_GROUP","CREATE_UNICODE_ENVIRONMENT","CREATE_BREAKAWAY_FROM_JOB","CREATE_DEFAULT_ERROR_MODE","CREATE_NO_WINDOW","EXTENDED_STARTUPINFO_PRESENT"]),thread_creation:b(["CREATE_SUSPENDED","STACK_SIZE_PARAM_IS_A_RESERVATION"]),wait_timeout:O("INFINITE"),std_handle:O("STD_INPUT_HANDLE","STD_OUTPUT_HANDLE","STD_ERROR_HANDLE"),heap_flags:b(["HEAP_NO_SERIALIZE","HEAP_GROWABLE","HEAP_GENERATE_EXCEPTIONS","HEAP_ZERO_MEMORY","HEAP_REALLOC_IN_PLACE_ONLY","HEAP_CREATE_ENABLE_EXECUTE"]),local_alloc_flags:b(["LMEM_MOVEABLE","LMEM_ZEROINIT","LMEM_FIXED"]),global_alloc_flags:b(["GMEM_MOVEABLE","GMEM_ZEROINIT","GMEM_FIXED"]),load_library_flags:b(["DONT_RESOLVE_DLL_REFERENCES","LOAD_LIBRARY_AS_DATAFILE","LOAD_WITH_ALTERED_SEARCH_PATH","LOAD_IGNORE_CODE_AUTHZ_LEVEL","LOAD_LIBRARY_AS_IMAGE_RESOURCE","LOAD_LIBRARY_AS_DATAFILE_EXCLUSIVE","LOAD_LIBRARY_SEARCH_DLL_LOAD_DIR","LOAD_LIBRARY_SEARCH_APPLICATION_DIR","LOAD_LIBRARY_SEARCH_USER_DIRS","LOAD_LIBRARY_SEARCH_SYSTEM32","LOAD_LIBRARY_SEARCH_DEFAULT_DIRS"]),registry_key:O("HKEY_CLASSES_ROOT","HKEY_CURRENT_USER","HKEY_LOCAL_MACHINE","HKEY_USERS","HKEY_PERFORMANCE_DATA","HKEY_CURRENT_CONFIG"),registry_access:b(["KEY_ALL_ACCESS","KEY_READ","KEY_WRITE","KEY_QUERY_VALUE","KEY_SET_VALUE","KEY_CREATE_SUB_KEY","KEY_ENUMERATE_SUB_KEYS","KEY_NOTIFY","KEY_CREATE_LINK","KEY_WOW64_64KEY","KEY_WOW64_32KEY"]),registry_options:b(["REG_OPTION_VOLATILE","REG_OPTION_CREATE_LINK","REG_OPTION_BACKUP_RESTORE"]),registry_type:O("REG_NONE","REG_SZ","REG_EXPAND_SZ","REG_BINARY","REG_DWORD","REG_DWORD_BIG_ENDIAN","REG_LINK","REG_MULTI_SZ","REG_QWORD"),code_page:O("CP_ACP","CP_OEMCP","CP_MACCP","CP_THREAD_ACP","CP_UTF7","CP_UTF8"),format_message_flags:b(["FORMAT_MESSAGE_ALLOCATE_BUFFER","FORMAT_MESSAGE_IGNORE_INSERTS","FORMAT_MESSAGE_FROM_STRING","FORMAT_MESSAGE_FROM_HMODULE","FORMAT_MESSAGE_FROM_SYSTEM","FORMAT_MESSAGE_ARGUMENT_ARRAY"]),toolhelp_flags:b(["TH32CS_SNAPALL","TH32CS_SNAPHEAPLIST","TH32CS_SNAPPROCESS","TH32CS_SNAPTHREAD","TH32CS_SNAPMODULE","TH32CS_SNAPMODULE32","TH32CS_INHERIT"]),duplicate_options:b(["DUPLICATE_CLOSE_SOURCE","DUPLICATE_SAME_ACCESS"]),message_box:b(["MB_DEFBUTTON2","MB_DEFBUTTON3","MB_SYSTEMMODAL","MB_TASKMODAL","MB_SETFOREGROUND","MB_TOPMOST","MB_SERVICE_NOTIFICATION"],[{mask:"MB_TYPEMASK",names:["MB_OK","MB_OKCANCEL","MB_ABORTRETRYIGNORE","MB_YESNOCANCEL","MB_YESNO","MB_RETRYCANCEL","MB_CANCELTRYCONTINUE"]},{mask:"MB_ICONMASK",names:["MB_ICONERROR","MB_ICONQUESTION","MB_ICONWARNING","MB_ICONINFORMATION"]}]),show_window:O("SW_HIDE","SW_SHOWNORMAL","SW_SHOWMINIMIZED","SW_SHOWMAXIMIZED","SW_SHOWNOACTIVATE","SW_SHOW","SW_MINIMIZE","SW_SHOWMINNOACTIVE","SW_SHOWNA","SW_RESTORE","SW_SHOWDEFAULT","SW_FORCEMINIMIZE"),window_message:O("WM_NULL","WM_CREATE","WM_DESTROY","WM_MOVE","WM_SIZE","WM_ACTIVATE","WM_SETFOCUS","WM_KILLFOCUS","WM_ENABLE","WM_SETTEXT","WM_GETTEXT","WM_GETTEXTLENGTH","WM_PAINT","WM_CLOSE","WM_QUIT","WM_SHOWWINDOW","WM_SETCURSOR","WM_GETMINMAXINFO","WM_NOTIFY","WM_SETICON","WM_KEYDOWN","WM_KEYUP","WM_CHAR","WM_INITDIALOG","WM_COMMAND","WM_SYSCOMMAND","WM_TIMER","WM_HSCROLL","WM_VSCROLL","WM_MOUSEMOVE","WM_LBUTTONDOWN","WM_LBUTTONUP","WM_RBUTTONDOWN","WM_RBUTTONUP","WM_MOUSEWHEEL","WM_USER","WM_APP"),window_long_index:O("GWLP_WNDPROC","GWLP_HINSTANCE","GWLP_HWNDPARENT","GWLP_ID","GWL_STYLE","GWL_EXSTYLE","GWLP_USERDATA")},Ae={1:"open_flags",2:"file_mode"},Jt={2:"open_flags",3:"file_mode"},we={3:"message_flags"},ei={1:"access_rights",2:"file_share",4:"creation_disposition",5:"file_attributes"},ti={0:"registry_key",3:"registry_access"},rn={open:Ae,open64:Ae,__open_2:{1:"open_flags"},openat:Jt,openat64:Jt,_open:Ae,_wopen:Ae,creat:{1:"file_mode"},mkdir:{1:"file_mode"},mkdirat:{2:"file_mode"},chmod:{1:"file_mode"},fchmod:{1:"file_mode"},fchmodat:{2:"file_mode"},mkfifo:{1:"file_mode"},umask:{0:"file_mode"},shm_open:{1:"open_flags",2:"file_mode"},access:{1:"access_mode"},faccessat:{2:"access_mode"},euidaccess:{1:"access_mode"},lseek:{2:"whence"},lseek64:{2:"whence"},fseek:{2:"whence"},fseeko:{2:"whence"},fseeko64:{2:"whence"},_lseek:{2:"whence"},_fseeki64:{2:"whence"},fcntl:{1:"fcntl_command"},fcntl64:{1:"fcntl_command"},ioctl:{1:"ioctl_request"},mmap:{2:"protection",3:"map_flags"},mmap64:{2:"protection",3:"map_flags"},mprotect:{2:"protection"},msync:{2:"msync_flags"},madvise:{2:"madvise_advice"},posix_madvise:{2:"madvise_advice"},socket:{0:"address_family",1:"socket_type",2:"ip_protocol"},socketpair:{0:"address_family",1:"socket_type"},inet_pton:{0:"address_family"},inet_ntop:{0:"address_family"},setsockopt:{1:"socket_level"},getsockopt:{1:"socket_level"},send:we,recv:we,sendto:we,recvfrom:we,sendmsg:{2:"message_flags"},recvmsg:{2:"message_flags"},shutdown:{1:"shutdown_how"},signal:{0:"signal",1:"signal_handler"},sigset:{0:"signal",1:"signal_handler"},bsd_signal:{0:"signal",1:"signal_handler"},sysv_signal:{0:"signal",1:"signal_handler"},sigaction:{0:"signal"},raise:{0:"signal"},kill:{1:"signal"},killpg:{1:"signal"},pthread_kill:{1:"signal"},sigaddset:{1:"signal"},sigdelset:{1:"signal"},sigismember:{1:"signal"},siginterrupt:{0:"signal"},psignal:{0:"signal"},strsignal:{0:"signal"},sigprocmask:{0:"sigmask_how"},pthread_sigmask:{0:"sigmask_how"},waitpid:{2:"wait_options"},wait3:{1:"wait_options"},wait4:{2:"wait_options"},dlopen:{1:"dlopen_mode"},dlsym:{0:"dlsym_handle"},flock:{1:"flock_operation"},clock_gettime:{0:"clock_id"},clock_getres:{0:"clock_id"},clock_nanosleep:{0:"clock_id"},setlocale:{0:"locale_category"},getrlimit:{0:"rlimit_resource"},setrlimit:{0:"rlimit_resource"},setvbuf:{2:"buffer_mode"},sysconf:{0:"sysconf_name"},epoll_ctl:{1:"epoll_op"},epoll_create1:{0:"cloexec_flags"},eventfd:{1:"cloexec_flags"},pthread_mutexattr_settype:{1:"mutex_type"},ptrace:{0:"ptrace_request"},prctl:{0:"prctl_option"},CreateFileA:ei,CreateFileW:ei,CreateFile2:{1:"access_rights",2:"file_share",3:"creation_disposition"},VirtualAlloc:{2:"allocation_type",3:"page_protection"},VirtualAllocEx:{3:"allocation_type",4:"page_protection"},VirtualProtect:{2:"page_protection"},VirtualProtectEx:{3:"page_protection"},VirtualFree:{2:"free_type"},VirtualFreeEx:{3:"free_type"},CreateFileMappingA:{2:"page_protection"},CreateFileMappingW:{2:"page_protection"},MapViewOfFile:{1:"file_map_access"},MapViewOfFileEx:{1:"file_map_access"},OpenFileMappingW:{0:"file_map_access"},SetFilePointer:{3:"move_method"},SetFilePointerEx:{3:"move_method"},OpenProcess:{0:"process_access"},OpenThread:{0:"thread_access"},CreateProcessA:{5:"process_creation"},CreateProcessW:{5:"process_creation"},CreateProcessAsUserW:{6:"process_creation"},CreateThread:{4:"thread_creation"},CreateRemoteThread:{5:"thread_creation"},WaitForSingleObject:{1:"wait_timeout"},WaitForSingleObjectEx:{1:"wait_timeout"},WaitForMultipleObjects:{3:"wait_timeout"},Sleep:{0:"wait_timeout"},GetStdHandle:{0:"std_handle"},HeapAlloc:{1:"heap_flags"},HeapReAlloc:{1:"heap_flags"},HeapFree:{1:"heap_flags"},HeapCreate:{0:"heap_flags"},LocalAlloc:{0:"local_alloc_flags"},GlobalAlloc:{0:"global_alloc_flags"},LoadLibraryExA:{2:"load_library_flags"},LoadLibraryExW:{2:"load_library_flags"},RegOpenKeyExA:ti,RegOpenKeyExW:ti,RegCreateKeyExA:{0:"registry_key",4:"registry_options",5:"registry_access"},RegCreateKeyExW:{0:"registry_key",4:"registry_options",5:"registry_access"},RegOpenKeyA:{0:"registry_key"},RegOpenKeyW:{0:"registry_key"},RegGetValueA:{0:"registry_key"},RegGetValueW:{0:"registry_key"},RegSetValueExA:{3:"registry_type"},RegSetValueExW:{3:"registry_type"},RegDeleteKeyExW:{2:"registry_access"},MultiByteToWideChar:{0:"code_page"},WideCharToMultiByte:{0:"code_page"},FormatMessageA:{0:"format_message_flags"},FormatMessageW:{0:"format_message_flags"},CreateToolhelp32Snapshot:{0:"toolhelp_flags"},DuplicateHandle:{6:"duplicate_options"},MessageBoxA:{3:"message_box"},MessageBoxW:{3:"message_box"},MessageBoxExW:{3:"message_box"},ShowWindow:{1:"show_window"},SendMessageA:{1:"window_message"},SendMessageW:{1:"window_message"},PostMessageA:{1:"window_message"},PostMessageW:{1:"window_message"},DefWindowProcA:{1:"window_message"},DefWindowProcW:{1:"window_message"},PostThreadMessageW:{1:"window_message"},GetWindowLongPtrA:{1:"window_long_index"},GetWindowLongPtrW:{1:"window_long_index"},SetWindowLongPtrA:{1:"window_long_index"},SetWindowLongPtrW:{1:"window_long_index"},GetWindowLongW:{1:"window_long_index"},SetWindowLongW:{1:"window_long_index"},WSASocketW:{0:"address_family",1:"socket_type",2:"ip_protocol"}};function As(s,e){throw new ur({code:s,severity:"error",message:e,evidence_ids:[]})}function ws(s,e,t){return{schema_version:dr,project_id:s,revision:e,versions:{backend:"open-decomp/1",loader:null,decoder:null,lifter:null,analysis:"navigation/2",abi:null,emitter:null},options:si,budget:t,coverage:[],diagnostics:[],evidence:[],artifacts:[]}}function an(s,e,t=si){s.state!=="queued"&&As("worker_failed",`Admission acknowledgement was lost for ${s.id}; inspect its durable status`);const i=ws(s.project_id,s.input_revision,e);return{...i,versions:{...i.versions,analysis:null},options:t,state:"queued",job:s}}const sn=3,nn="application/vnd.open-decomp.function+json",on=16*1024*1024,Ts=new Map([["int8_t",{kind:"integer",bits:8,signed:!0}],["uint8_t",{kind:"integer",bits:8,signed:!1}],["int16_t",{kind:"integer",bits:16,signed:!0}],["uint16_t",{kind:"integer",bits:16,signed:!1}],["int32_t",{kind:"integer",bits:32,signed:!0}],["uint32_t",{kind:"integer",bits:32,signed:!1}],["int64_t",{kind:"integer",bits:64,signed:!0}],["uint64_t",{kind:"integer",bits:64,signed:!1}],["int128_t",{kind:"integer",bits:128,signed:!0}],["uint128_t",{kind:"integer",bits:128,signed:!1}],["bool",{kind:"integer",bits:8,signed:!1}],["float",{kind:"float",bits:32}],["double",{kind:"float",bits:64}],["long double",{kind:"float",bits:80}],["void",{kind:"void"}]]);function Te(s){return Ts.get(s)??null}function ys(s){return s.kind==="integer"?s.bits/8:s.kind==="float"?s.bits===80?16:s.bits/8:s.kind==="pointer"?8:null}function Ns(s){const e=[["int8_t","int8_t"],["uint8_t","uint8_t"],["int16_t","int16_t"],["uint16_t","uint16_t"],["int32_t","int32_t"],["uint32_t","uint32_t"],["int64_t","int64_t"],["uint64_t","uint64_t"],["intptr_t","int64_t"],["uintptr_t","uint64_t"],["intmax_t","int64_t"],["uintmax_t","uint64_t"],["ptrdiff_t","int64_t"],["ssize_t","int64_t"],["size_t","uint64_t"],["bool","bool"],["_Bool","bool"],["char16_t","uint16_t"],["char32_t","uint32_t"],["wchar_t",s.abi==="windows-x64"?"uint16_t":"int32_t"],["__int128_t","int128_t"],["__uint128_t","uint128_t"]];return new Map(e)}function vs(){return{signed:!1,unsigned:!1,short:!1,long:0,char:!1,int:!1,float:!1,double:!1,void:!1,int128:!1,sized:null}}function Ds(s,e){if(s.signed&&s.unsigned)return null;const t=s.unsigned?"u":"",i=r=>`${t}int${r}_t`,a=(...r)=>r.every(n=>!n);return s.void?a(s.signed,s.unsigned,s.short,s.long>0,s.char,s.int,s.float,s.double,s.int128,s.sized!==null)?"void":null:s.float?a(s.signed,s.unsigned,s.short,s.long>0,s.char,s.int,s.double,s.int128,s.sized!==null)?"float":null:s.double?!a(s.signed,s.unsigned,s.short,s.char,s.int,s.int128,s.sized!==null)||s.long>1?null:s.long===0?"double":e.abi==="sysv-amd64"?"long double":"double":s.int128?a(s.short,s.long>0,s.char,s.int,s.sized!==null)?i(128):null:s.sized!==null?a(s.short,s.long>0,s.char,s.int)?i(s.sized):null:s.char?a(s.short,s.long>0,s.int)?i(8):null:s.short?s.long===0?i(16):null:s.long===1?i(e.abi==="windows-x64"?32:64):s.long===2?i(64):s.long>2?null:i(32)}const Ls=["...","<<",">>","<=",">=","==","!=","&&","||","->"],bs=new Set([1,2,4,8,16]);function pi(s){return s>="a"&&s<="z"||s>="A"&&s<="Z"||s==="_"||s==="$"}function st(s){return s>="0"&&s<="9"}function ii(s){return pi(s)||st(s)}function Os(s){const e=[],t=[],i=[];let a=null,r=0,n=1,o=0,c=!0;const _=m=>m-o+1,u=(m,p,S)=>{t.push({message:m,line:p,column:S})},d=()=>{s[r]==="\r"&&s[r+1]===`
`&&r++,r++,n++,o=r,c=!0},h=(m,p,S)=>{e.push({kind:m,text:s.slice(p,S),line:n,column:_(p),pack:a})},C=(m,p,S)=>{const F=/^#\s*pragma\s+pack\b\s*(?:\(([^)]*)\))?\s*$/.exec(m);if(!F)return;const y=(F[1]??"").split(",").map(P=>P.trim()).filter(P=>P.length>0),k=P=>!/^[0-9]+$/.test(P)||!bs.has(Number(P))?(u(`invalid #pragma pack value '${P}'`,p,S),null):Number(P),I=y[0];if(I===void 0)a=null;else{if(I==="show")return;if(I==="push"){i.push(a);const P=y.find((J,Y)=>Y>0&&/^[0-9]+$/.test(J));P!==void 0&&(a=k(P))}else if(I==="pop"){i.length===0?u("#pragma pack(pop) without matching push",p,S):a=i.pop()??null;const P=y.find((J,Y)=>Y>0&&/^[0-9]+$/.test(J));P!==void 0&&(a=k(P))}else a=k(I)}};for(;r<s.length;){const m=s[r];if(m===`
`||m==="\r"){d();continue}if(m===" "||m==="	"||m==="\f"||m==="\v"){r++;continue}if(m==="/"&&s[r+1]==="/"){for(;r<s.length&&s[r]!==`
`&&s[r]!=="\r";)r++;continue}if(m==="/"&&s[r+1]==="*"){const F=n,y=_(r);r+=2;let k=!1;for(;r<s.length;){if(s[r]==="*"&&s[r+1]==="/"){r+=2,k=!0;break}s[r]===`
`||s[r]==="\r"?(d(),c=!1):r++}k||u("unterminated comment",F,y);continue}if(m==="#"&&c){const F=n,y=_(r);let k="";for(;;){const I=r;for(;r<s.length&&s[r]!==`
`&&s[r]!=="\r";)r++;const P=s.slice(I,r);if(P.endsWith("\\")&&r<s.length){k+=P.slice(0,-1),d(),c=!1;continue}k+=P;break}C(k.replace(/\/\*.*?\*\//g," ").replace(/\/\/.*$/,""),F,y);continue}c=!1;const p=r;if(pi(m)){for(r++;r<s.length&&ii(s[r]);)r++;h("ident",p,r);continue}if(st(m)||m==="."&&st(s[r+1]??"")){r++;const F=/^0[xX]/.test(s.slice(p,p+2));for(;r<s.length;){const y=s[r];if(ii(y)||y===".")r++;else if((y==="+"||y==="-")&&!F&&/[eE]/.test(s[r-1]))r++;else break}h("number",p,r);continue}if(m==='"'||m==="'"){r++;let F=!1;for(;r<s.length;){const y=s[r];if(y===`
`||y==="\r")break;if(r++,y==="\\"&&r<s.length&&s[r]!==`
`&&s[r]!=="\r")r++;else if(y===m){F=!0;break}}F||u(`unterminated ${m==='"'?"string":"character"} literal`,n,_(p)),h(m==='"'?"string":"char",p,r);continue}const S=Ls.find(F=>s.startsWith(F,r));if(S!==void 0){r+=S.length,h("punct",p,r);continue}if("{}()[];,*=:<>+-/%&|^~!?.#".includes(m)){r++,h("punct",p,r);continue}u(`unexpected character '${m}'`,n,_(p)),r++}return e.push({kind:"eof",text:"",line:n,column:_(r),pack:a}),{tokens:e,diagnostics:t}}class Je{message;index;constructor(e,t){this.message=e,this.index=t}}const Ps=128,ri=0xffffffffffffffffn,ks=new Map([["__int8",8],["__int16",16],["__int32",32],["__int64",64]]),de=new Set(["const","__const","__const__","volatile","__volatile","__volatile__","restrict","__restrict","__restrict__","_Atomic","static","extern","register","auto","inline","__inline","__inline__","__forceinline","_Noreturn","__extension__","_Thread_local","__thread","__unaligned","__w64"]),ye=new Set(["__cdecl","__stdcall","__fastcall","__thiscall","__vectorcall","__clrcall"]),Ne=new Set(["__attribute__","__attribute","__declspec","__asm__","__asm","asm","_Alignas"]),et=new Set(["void","char","short","int","long","signed","unsigned","__signed","__signed__","float","double","__int128","__int8","__int16","__int32","__int64"]),tt=new Set(["struct","union","enum"]),Ms=new Map([["||",1],["&&",2],["|",3],["^",4],["&",5],["==",6],["!=",6],["<",7],[">",7],["<=",7],[">=",7],["<<",8],[">>",8],["+",9],["-",9],["*",10],["/",10],["%",10]]);function ai(s,e){const t=BigInt(e);return(s+t-1n)/t*t}function xs(s,e){return JSON.stringify(s,(t,i)=>typeof i=="bigint"?`${i}n`:i)===JSON.stringify(e,(t,i)=>typeof i=="bigint"?`${i}n`:i)}function Hs(s,e){switch(s.kind){case"pointer":return{...s,to:e(s.to)};case"array":case"vector":return{...s,element:e(s.element)};case"structure":return{...s,fields:s.fields.map(t=>({...t,type_id:e(t.type_id)}))};default:return s}}function zs(s){switch(s.kind){case"pointer":return[s.to];case"array":case"vector":return[s.element];case"structure":return s.fields.map(e=>e.type_id);default:return[]}}class Ws{target;tokens;diagnostics;typedefNames;defs=new Map;tags=new Map;typedefs=new Map;owners=new Map;named=new Map;enumerators=new Map;constants=new Map;defining=new Set;completed=new Set;pos=0;depth=0;anonymous=0;constructor(e,t){this.target=t;const i=Os(e);this.tokens=i.tokens,this.diagnostics=[...i.diagnostics],this.typedefNames=Ns(t)}parse(){for(;this.tok().kind!=="eof";){const e=this.pos;if(!this.acceptPunct(";")){try{this.parseTopLevelDeclaration()}catch(t){if(!(t instanceof Je))throw t;this.depth=0,this.report(t),this.recover(e,t.index,!1)}this.dropPlaceholders()}}return this.diagnostics.sort((e,t)=>e.line-t.line||e.column-t.column),{types:this.ordered(),named:this.named,enumerators:this.enumerators,diagnostics:this.diagnostics}}tok(e=0){return this.tokens[Math.min(this.pos+e,this.tokens.length-1)]}next(){const e=this.tok();return e.kind!=="eof"&&this.pos++,e}isPunct(e,t=0){const i=this.tok(t);return i.kind==="punct"&&i.text===e}isIdent(e,t=0){const i=this.tok(t);return i.kind==="ident"&&i.text===e}acceptPunct(e){return this.isPunct(e)?(this.pos++,!0):!1}expectPunct(e){return this.isPunct(e)||this.fail(`expected '${e}', found ${this.describe(this.tok())}`),this.next()}describe(e){return e.kind==="eof"?"end of input":`'${e.text}'`}fail(e,t=this.pos){throw new Je(e,Math.min(t,this.tokens.length-1))}failAt(e,t){this.fail(t,this.tokens.indexOf(e))}report(e){const t=this.tokens[e.index];this.diagnostics.push({message:e.message,line:t.line,column:t.column})}error(e,t){this.diagnostics.push({message:t,line:e.line,column:e.column})}enter(){++this.depth>Ps&&this.fail("declaration nesting is too deep")}skipBalanced(){const e=this.next().text,t=e==="("?")":e==="["?"]":"}";let i=1;for(;i>0;){const a=this.tok();a.kind==="eof"&&this.fail(`unterminated '${e}'`),this.pos++,a.kind==="punct"&&(a.text===e?i++:a.text===t&&i--)}}recover(e,t,i){let a=0;for(let r=e;r<this.tokens.length-1;r++){const n=this.tokens[r];if(n.kind==="punct"){if(n.text==="{")a++;else if(n.text==="}"){if(a>0)a--;else if(r>=t){this.pos=i?r:r+1;return}}else if(n.text===";"&&a===0&&r>=t){this.pos=r+1;return}}}this.pos=this.tokens.length-1}placeholder(){return`<anon${this.anonymous++}>`}dropPlaceholders(){for(const e of[...this.defs.keys()])e.startsWith("<")&&this.defs.delete(e);for(const e of[...this.enumerators.keys()])e.startsWith("<")&&this.enumerators.delete(e)}definitionOf(e){return this.defs.get(e)?.def??Te(e)}ensure(e){if(!this.defs.has(e)){const t=Te(e);t&&this.defs.set(e,{name:null,def:t})}return e}claim(e,t,i){const a=this.owners.get(t)??(Te(t)?"a builtin type":null);a!==null&&this.failAt(e,`'${t}' is already declared as ${a}`),this.owners.set(t,i)}rename(e,t){const i=n=>n===e?t:n.startsWith(e)&&"$#.".includes(n[e.length])?t+n.slice(e.length):n,a=[...this.defs];this.defs.clear();for(const[n,o]of a)this.defs.set(i(n),{name:o.name,def:Hs(o.def,i)});const r=this.enumerators.get(e);r&&(this.enumerators.delete(e),this.enumerators.set(t,r))}measure(e,t=!1){switch(e.k){case"fn":return null;case"ptr":return{size:8n,align:8,flexible:!1};case"arr":{const i=this.measure(e.of);return i?this.arrayMeasure(i,e.count,t):null}case"named":{const i=this.definitionOf(e.key);return i?this.measureDefinition(i,t):null}}}arrayMeasure(e,t,i){if(t===null)return i?{size:0n,align:e.align,flexible:!0}:null;const a=e.size*t;return a>ri&&this.fail("array is too large"),{size:a,align:e.align,flexible:!1}}measureDefinition(e,t){const i=ys(e);if(i!==null)return{size:BigInt(i),align:i,flexible:!1};switch(e.kind){case"array":{const a=this.measure({k:"named",key:e.element,tag:!1});return a?this.arrayMeasure(a,e.count,t):null}case"structure":return e.size===null?null:{size:e.size,align:e.alignment??1,flexible:!1};case"unknown":return e.size===null?null:{size:e.size,align:1,flexible:!1};default:return null}}mat(e,t,i=0){switch(e.k){case"named":return this.ensure(e.key);case"fn":return this.fail("a function type cannot be used here");case"ptr":{const a=i===0?t:`${t}#${i}`,r=e.to.k==="fn"?this.ensure("void"):this.mat(e.to,t,i+1);return this.defs.set(a,{name:null,def:{kind:"pointer",to:r,bits:64}}),a}case"arr":{const a=i===0?t:`${t}#${i}`;this.measure(e.of)||this.fail("array element has incomplete type");const r=this.mat(e.of,t,i+1);return this.defs.set(a,{name:null,def:{kind:"array",element:r,count:e.count}}),a}}}layout(e,t,i,a,r){const n=r.packed?1:a,o=[],c=new Set;let _=0n,u=0n,d=1;const h=(m,p,S)=>{let F=n===null?p:Math.min(p,n);S?.packed&&(F=1),S?.aligned!=null&&(F=S.packed?S.aligned:Math.max(F,S.aligned)),d=Math.max(d,F);const y=e==="union"?0n:ai(_,F);return _=y+m,u=_>u?_:u,y},C=(m,p,S,F)=>{c.has(p)&&this.error(m,`duplicate member '${p}'`),c.add(p),o.push({id:p,name:p,offset:S,type_id:F})};return i.forEach((m,p)=>{if(m.kind==="anon"){const I=`${t}$_${p}`;this.rename(m.ty.key,I);const P=this.defs.get(I)?.def;if(this.defs.delete(I),P?.kind!=="structure"||P.size===null)return;const J=h(P.size,P.alignment??1,null);for(const Y of P.fields)C(m.tok,Y.name,J+Y.offset,Y.type_id);return}const S=m.name,F=S.text;if(m.ty.k==="fn")return this.error(S,`member '${F}' has function type`);const y=this.measure(m.ty,!0);if(!y)return this.error(S,`member '${F}' has incomplete type`);y.flexible&&p!==i.length-1&&this.error(S,`flexible array member '${F}' must be last`);const k=h(y.size,y.align,m.attrs);C(S,F,k,this.mat(m.ty,`${t}$${F}`))}),r.aligned!==null&&(d=Math.max(d,r.aligned)),{kind:"structure",size:ai(u,d),alignment:d,fields:o}}noise(){const e={packed:!1,aligned:null};for(;;){const t=this.tok();if(t.kind!=="ident")return e;if(de.has(t.text)||ye.has(t.text)){this.pos++;continue}if(!Ne.has(t.text))return e;this.pos++,this.attribute(t.text,e)}}attribute(e,t){if(e==="asm"||e==="__asm"||e==="__asm__"){this.expectPunct("("),this.pos--,this.skipBalanced();return}if(e==="_Alignas"){this.expectPunct("("),t.aligned=this.alignment(this.constant()),this.expectPunct(")");return}if(this.expectPunct("("),e==="__declspec"){for(;!this.isPunct(")");){const i=this.next();i.kind==="eof"&&this.fail("unterminated '__declspec'"),i.text==="align"&&this.acceptPunct("(")?(t.aligned=this.alignment(this.constant()),this.expectPunct(")")):this.isPunct("(")&&this.skipBalanced()}this.expectPunct(")");return}for(this.expectPunct("(");!this.isPunct(")");){const i=this.next();i.kind!=="ident"&&this.fail(`unexpected ${this.describe(i)} in attribute`);const a=i.text.replace(/^__|__$/g,"");if(a==="packed"&&(t.packed=!0),a==="aligned"||a==="align"?this.acceptPunct("(")?(t.aligned=this.alignment(this.constant()),this.expectPunct(")")):t.aligned=16:this.isPunct("(")&&this.skipBalanced(),!this.acceptPunct(","))break}this.expectPunct(")"),this.expectPunct(")")}alignment(e){return(e<1n||e>65536n||(e&e-1n)!==0n)&&this.fail("alignment must be a power of two between 1 and 65536"),Number(e)}constant(e=0){this.enter();try{let t=this.unary();for(;;){const i=this.tok();if(i.kind!=="punct")break;if(i.text==="?"&&e===0){this.pos++;const n=this.constant();this.expectPunct(":");const o=this.constant();t=t!==0n?n:o;continue}const a=Ms.get(i.text);if(a===void 0||a<=e)break;this.pos++;const r=this.constant(a);t=this.binary(i,t,r)}return t}finally{this.depth--}}binary(e,t,i){const a=r=>BigInt.asIntN(64,r);switch(e.text){case"||":return t!==0n||i!==0n?1n:0n;case"&&":return t!==0n&&i!==0n?1n:0n;case"|":return t|i;case"^":return t^i;case"&":return t&i;case"==":return t===i?1n:0n;case"!=":return t!==i?1n:0n;case"<":return t<i?1n:0n;case">":return t>i?1n:0n;case"<=":return t<=i?1n:0n;case">=":return t>=i?1n:0n;case"<<":case">>":return(i<0n||i>63n)&&this.failAt(e,"shift count out of range"),a(e.text==="<<"?t<<i:t>>i);case"+":return a(t+i);case"-":return a(t-i);case"*":return a(t*i);default:return i===0n&&this.failAt(e,"division by zero in constant expression"),e.text==="/"?a(t/i):t%i}}unary(){const e=this.next();if(e.kind==="number")return this.integerLiteral(e);if(e.kind==="char")return this.characterLiteral(e);if(e.kind==="ident"){if(e.text==="sizeof")return this.sizeofType();const t=this.constants.get(e.text);return t===void 0&&this.failAt(e,`'${e.text}' is not a known integer constant`),t}if(e.kind==="punct")switch(e.text){case"-":return BigInt.asIntN(64,-this.unary());case"+":return this.unary();case"~":return BigInt.asIntN(64,~this.unary());case"!":return this.unary()===0n?1n:0n;case"(":{const t=this.constant();return this.expectPunct(")"),t}}return this.failAt(e,`expected a constant expression, found ${this.describe(e)}`)}integerLiteral(e){const t=/^(0[xX][0-9a-fA-F]+|0[bB][01]+|0[0-7]*|[1-9][0-9]*)([uUlL]*)$/.exec(e.text);if(!t)return this.failAt(e,`'${e.text}' is not an integer constant`);const i=t[1],a=BigInt(/^0[0-7]+$/.test(i)?`0o${i.slice(1)}`:i);return a>ri&&this.failAt(e,"integer constant is too large"),BigInt.asIntN(64,a)}characterLiteral(e){const t=e.text.slice(1,-1),i={n:10,t:9,r:13,0:0,a:7,b:8,f:12,v:11,"\\":92,"'":39,'"':34};if(t.length===1)return BigInt(t.charCodeAt(0));if(t.length===2&&t[0]==="\\"&&i[t[1]]!==void 0)return BigInt(i[t[1]]);const a=/^\\x([0-9a-fA-F]{1,2})$/.exec(t);return a?BigInt(parseInt(a[1],16)):this.failAt(e,`unsupported character constant ${e.text}`)}sizeofType(){this.expectPunct("("),this.startsType(this.tok())||this.fail("sizeof is supported only for type names");const e=this.specifiers();e.base||this.fail("expected a type");const t=this.declarator(e.base,!0,!1),i=this.measure(t.ty);return i||this.fail("sizeof applied to an incomplete type"),this.expectPunct(")"),i.size}startsType(e){if(e.kind!=="ident")return!1;const t=e.text;return et.has(t)||tt.has(t)||de.has(t)||t==="typedef"||this.typedefs.has(t)||this.typedefNames.has(t)}typedefType(e){const t=this.typedefs.get(e);if(t)return t;const i=this.typedefNames.get(e);return i===void 0?null:{k:"named",key:i,tag:!1}}specifiers(){const e={base:null,typedef:!1,anon:null,bound:!1,attrs:{packed:!1,aligned:null}},t=vs();let i=!1;for(;;){const a=this.tok();if(a.kind!=="ident")break;const r=a.text;if(de.has(r)||ye.has(r)||Ne.has(r)){const n=this.noise();e.attrs.packed||=n.packed,e.attrs.aligned=n.aligned??e.attrs.aligned;continue}if(r==="typedef"){e.typedef=!0,this.pos++;continue}if(et.has(r)){e.base&&this.fail(`unexpected '${r}' after a type`),this.pos++,i=!0,this.addWord(t,r);continue}if(tt.has(r)){(e.base||i)&&this.fail(`unexpected '${r}' after a type`);const n=this.aggregate();e.base=n.ty,n.anon&&(e.anon={ty:n.ty,kind:n.kind});continue}if(!e.base&&!i){const n=this.typedefType(r);if(n){e.base=n,this.pos++;continue}}break}if(i){const a=Ds(t,this.target);a===null&&this.fail("invalid combination of type specifiers"),e.base={k:"named",key:a,tag:!1}}return e}addWord(e,t){switch(t){case"void":case"char":case"int":case"float":case"double":case"short":e[t]&&this.fail(`duplicate '${t}'`,this.pos-1),e[t]=!0;return;case"long":e.long++;return;case"signed":case"__signed":case"__signed__":e.signed=!0;return;case"unsigned":e.unsigned=!0;return;case"__int128":e.int128=!0;return;default:e.sized=ks.get(t)??null}}aggregate(){const t=this.next().text,i=this.noise(),a=this.tok().kind==="ident"?this.next():null;if(a){const o=this.noise();i.packed||=o.packed,i.aligned=o.aligned??i.aligned}if(!this.isPunct("{")){a||this.fail(`expected a tag or '{' after '${t}'`);const o=this.tags.get(a.text);return o?(this.matchKind(a,o.kind,t),{ty:{k:"named",key:o.key,tag:!0},anon:!1,kind:t}):{ty:{k:"named",key:this.declareTag(a,t),tag:!0},anon:!1,kind:t}}let r,n;if(a){const o=this.tags.get(a.text);if(o){this.matchKind(a,o.kind,t),n=o.key;const c=this.defining.has(o.key)||this.completed.has(o.key);c&&this.error(a,`redefinition of ${t} '${a.text}'`),r=c?this.placeholder():o.key}else r=n=this.declareTag(a,t)}else r=n=this.placeholder();this.defining.add(r);try{t==="enum"?this.enumBody(r,a?.text??null):this.structBody(t,r,a?.text??null,i)}finally{this.defining.delete(r)}return{ty:{k:"named",key:n,tag:!0},anon:!a,kind:t}}matchKind(e,t,i){t!==i&&this.failAt(e,`'${e.text}' is ${t==="enum"?"an":"a"} ${t}, not ${i==="enum"?"an":"a"} ${i}`)}declareTag(e,t){const i=e.text;return this.claim(e,i,`${t} ${i}`),this.tags.set(i,{key:i,kind:t}),this.named.set(i,i),this.defs.set(i,{name:i,def:t==="enum"?{kind:"integer",bits:32,signed:!0}:{kind:"structure",size:null,alignment:null,fields:[]}}),i}enumBody(e,t){this.expectPunct("{");let i=0n;const a=[];for(this.enumerators.set(e,a);!this.isPunct("}");){const r=this.next();if(r.kind!=="ident"&&this.failAt(r,`expected an enumerator, found ${this.describe(r)}`),this.noise(),this.acceptPunct("=")&&(i=this.constant()),this.constants.set(r.text,i),a.push({name:r.text,value:i}),i=BigInt.asIntN(64,i+1n),!this.acceptPunct(","))break}this.expectPunct("}"),this.noise(),this.defs.set(e,{name:t,def:{kind:"integer",bits:32,signed:!0}}),this.completed.add(e)}structBody(e,t,i,a){const r=this.expectPunct("{"),n=[];for(;!this.isPunct("}");){this.tok().kind==="eof"&&this.fail(`unterminated ${e} body`);const c=this.pos,_=this.depth;if(!this.acceptPunct(";"))try{this.member(t,n)}catch(u){if(!(u instanceof Je))throw u;this.depth=_,this.report(u),this.recover(c,u.index,!0)}}this.expectPunct("}");const o=this.noise();a.packed||=o.packed,a.aligned=o.aligned??a.aligned,this.defs.set(t,{name:i,def:this.layout(e,t,n,r.pack,a)}),this.completed.add(t)}member(e,t){const i=this.tok(),a=this.requireSpecifiers();if(a.typedef&&this.failAt(i,"typedef is not allowed in a member declaration"),this.isPunct(";")){a.anon&&a.anon.kind!=="enum"?t.push({kind:"anon",ty:a.anon.ty,tok:i}):a.base?.k==="named"&&a.base.tag||this.failAt(i,"declaration does not declare anything"),this.pos++;return}for(;;){this.isPunct(":")&&this.fail("bit-fields are not supported");const r=this.declarator(a.base,!1,!1);if(r.name||this.fail("expected a member name"),this.isPunct(":")&&this.fail("bit-fields are not supported"),this.bindAnon(a,r,`${e}$${r.name.text}`,!1),t.push({kind:"field",name:r.name,ty:r.ty,attrs:{packed:a.attrs.packed||r.attrs.packed,aligned:r.attrs.aligned??a.attrs.aligned}}),!this.acceptPunct(","))break}this.expectPunct(";")}requireSpecifiers(){const e=this.tok(),t=this.specifiers();return t.base||this.failAt(e,e.kind==="ident"&&!this.startsType(e)?`unknown type name '${e.text}'`:`expected a type, found ${this.describe(e)}`),t}bindAnon(e,t,i,a){if(!e.anon||e.bound)return;e.bound=!0;let r=0,n=t.ty;for(;n.k==="ptr"||n.k==="arr";)r++,n=n.k==="ptr"?n.to:n.of;if(n.k==="fn")return;const o=r===0?i:`${i}#${r}`,c=t.name;if(a&&r===0){this.claim(c,i,`typedef ${i}`);const _=this.defs.get(e.anon.ty.key);_&&(_.name=i),this.named.set(i,i)}else this.defs.has(o)&&this.failAt(c,`'${o}' is already declared`);this.rename(e.anon.ty.key,o),e.anon.ty.key=o}declarator(e,t,i){this.enter();try{const a=this.noise();let r=e;for(;this.acceptPunct("*");){r={k:"ptr",to:r};const o=this.noise();a.packed||=o.packed}if(this.isPunct("(")&&this.nestedDeclarator()){const o=this.pos;this.skipBalanced();const c=this.pos;r=this.suffixes(r,i,a);const _=this.pos;this.pos=o+1;const u=this.declarator(r,t,i);return this.pos!==c-1&&this.fail(`unexpected ${this.describe(this.tok())} in declarator`),this.pos=_,a.packed||=u.attrs.packed,a.aligned=u.attrs.aligned??a.aligned,{name:u.name,ty:u.ty,attrs:a}}const n=this.tok().kind==="ident"&&!this.startsReserved(this.tok())?this.next():null;return!n&&!t&&this.fail(`expected a name, found ${this.describe(this.tok())}`),r=this.suffixes(r,i,a),{name:n,ty:r,attrs:a}}finally{this.depth--}}startsReserved(e){return et.has(e.text)||tt.has(e.text)||de.has(e.text)||ye.has(e.text)||Ne.has(e.text)||e.text==="typedef"}nestedDeclarator(){const e=this.tok(1);return e.kind==="punct"?e.text==="*"||e.text==="(":e.kind!=="ident"?!1:ye.has(e.text)||Ne.has(e.text)?!0:!this.startsType(e)}suffixes(e,t,i){const a=[];let r=e;for(;;){if(this.isPunct("[")){if(this.pos++,t){this.pos--,this.skipBalanced(),a.push(null);continue}for(;this.tok().kind==="ident"&&de.has(this.tok().text);)this.pos++;if(this.acceptPunct("]"))a.push(null);else{const o=this.tok(),c=this.constant();c<0n&&this.failAt(o,"array size is negative"),this.expectPunct("]"),a.push(c)}continue}this.isPunct("(")&&(this.parameters(),r={k:"fn"});break}for(let o=a.length-1;o>=0;o--)r={k:"arr",of:r,count:a[o]??null};const n=this.noise();return i.packed||=n.packed,i.aligned=n.aligned??i.aligned,r}parameters(){if(this.expectPunct("("),!this.acceptPunct(")")){if(this.isIdent("void")&&this.isPunct(")",1)){this.pos+=2;return}for(;!this.acceptPunct("...");){const e=this.requireSpecifiers();if(e.typedef&&this.fail("typedef is not allowed in a parameter"),this.declarator(e.base,!0,!0),!this.acceptPunct(","))break}this.expectPunct(")")}}parseTopLevelDeclaration(){const e=this.requireSpecifiers();if(!this.acceptPunct(";")){for(;;){const t=this.declarator(e.base,!1,!1);if(e.typedef)this.declareTypedef(e,t);else{if(this.isPunct("{"))return this.skipBalanced();this.acceptPunct("=")&&this.skipInitializer()}if(!this.acceptPunct(","))break}this.expectPunct(";")}}skipInitializer(){for(;;){const e=this.tok();if(e.kind==="eof")return;if(e.kind==="punct"){if(e.text===","||e.text===";")return;if(e.text==="("||e.text==="["||e.text==="{"){this.skipBalanced();continue}}this.pos++}}declareTypedef(e,t){const i=t.name,a=i.text;this.bindAnon(e,t,a,!0);const r=t.ty;if(r.k==="fn"){this.typedefs.has(a)&&this.failAt(i,`redefinition of typedef '${a}'`),this.typedefs.set(a,r);return}if(r.k==="named"&&r.tag){const o=this.typedefs.get(a);if(o){if(o.k==="named"&&o.key===r.key)return;this.failAt(i,`redefinition of typedef '${a}'`)}r.key!==a&&this.claim(i,a,`typedef ${a}`),this.typedefs.set(a,r),this.named.set(a,r.key);return}const n=Te(a);if(n&&r.k==="named"){const o=this.definitionOf(r.key);if(o&&xs(n,o)){this.typedefs.set(a,{k:"named",key:a,tag:!1});return}}if(this.claim(i,a,`typedef ${a}`),r.k==="named"){const o=this.definitionOf(r.key);o||this.failAt(i,`unknown type '${r.key}'`),this.defs.set(a,{name:a,def:o})}else{this.mat(r,a);const o=this.defs.get(a);o&&(o.name=a)}this.typedefs.set(a,{k:"named",key:a,tag:!1}),this.named.set(a,a)}ordered(){const e=[],t=new Map;for(const i of this.defs.keys()){if(t.has(i))continue;const a=[],r=n=>{t.set(n,1);const o=this.defs.get(n);a.push({key:n,deps:zs(o.def),index:0})};for(r(i);a.length>0;){const n=a[a.length-1],o=n.deps[n.index++];if(o!==void 0){!t.has(o)&&this.defs.has(o)&&r(o);continue}a.pop(),t.set(n.key,2);const c=this.defs.get(n.key);e.push({key:n.key,name:c.name,definition:c.def})}}return e}}function cn(s,e){return new Ws(s,e).parse()}const Us=s=>()=>{throw new Error(`${s} is not available in the browser`)},ln=Us("readline.createInterface"),_n=()=>0;export{nn as A,tn as C,on as M,an as a,ws as b,mr as c,sn as d,Xs as e,Ks as f,Ia as g,Rs as h,_n as i,Qs as j,Ys as k,$s as l,pr as m,rn as n,js as o,cn as p,As as q,qs as r,en as s,ln as t};
