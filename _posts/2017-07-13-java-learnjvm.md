---
layout: detail
title: java 学习历程 (一) 【窥探JVM】
tags: java 虚拟机  
categories: 编程语言
---

* TOC
{:toc}

# 序言
以前学过java，但是太久没用又荒废了。现在，笔者本着好奇心，再来学学看，为什么他就这么火。<br />
首先先上一张java整体架构图压压惊：<br />
![java整体架构图][JavaArchitecture]

# 大纲
按照笔者一向的风格，可能又要把他祖宗翻出来，说个透彻了。没错，是这样的。

## 命名
java为什么叫做java呢？原来是因为，大家说好，才是真的好。
~~~
据James Gosling回忆，最初这个为TV机顶盒所设计的语言在Sun内部一直称为Green项目。我们的新语
言需要一个名字。Gosling注意到自己办公室外一棵茂密的橡树Oak，这是一种在硅谷很常见的树。所以
他将这个新语言命名为Oak。但Oak是另外一个注册公司的名字。这个名字不可能再用了。
　　在命名征集会上，大家提出了很多名字。最后按大家的评选次序，将十几个名字排列成表，上报给
商标律师。排在第一位的是Silk(丝绸)。尽管大家都喜欢这个名字，但遭到James Gosling的坚决反对
。排在第二和第三的都没有通过律师这一关。只有排在第四位的名字、得到了所有人的认可和律师的通过
，这个名字就是Java。
~~~

## 思考
有人说他懂java，我不知道“懂”的定义是什么，只要是不扒个精光，看到底层，我都觉得是打马赛克的，好难受。本着奇怪的想法，笔者不先去学他的语法和框架，而是把他的那个JVM先窥探一番。

## 窥探JVM

### 什么是JVM
JVM就是java虚拟机，是架构在操作系统上面，妥协应用程序与系统底层之间的软件。（瞎解释一波 &lt; _ &lt;）

### JVM 的结构
千言万语不如图：<br />
![JVM][JVM]

#### JVM 执行引擎
![JVM执行引擎][JVMRunEngine]

#### JVM 内存空间
![JVM 内存空间][JVMMemory]

#### JVM 类加载器
→ 加载源，JVM 字节码的生成 <br />
![JVM 字节码的生成][JVMCode]<br />
→ 类加载器的运作<br />
![JVM 类加载器][classLoader]<br />

### JVM 源码分析
JVM源码是C语言写的，现在分析如下：<br />
#### 根据参数加载 JVM
【笔者这里，以1.7源码为例。】<br />
→ 首先找到main.c 【src/share/bin/main.c】，其中找到main函数入口，这是条件编译，条件是JAVAW的判断：<br />
无论如何会返回函数 JLI_Launch
~~~
...
#ifdef JAVAW
char **__initenv;
int WINAPI
WinMain(HINSTANCE inst, HINSTANCE previnst, LPSTR cmdline, int cmdshow){
    int margc;
    char** margv;
    const jboolean const_javaw = JNI_TRUE;
    __initenv = _environ;
    margc = __argc;
    margv = __argv;
#else /* JAVAW *
int main(int argc, char ** argv){
    int margc;
    char** margv;
    const jboolean const_javaw = JNI_FALSE;
    margc = argc;
    margv = argv;
#endif /* JAVAW */
    return JLI_Launch(margc, margv,
                   sizeof(const_jargs) / sizeof(char *), const_jargs,
                   sizeof(const_appclasspath) / sizeof(char *), const_appclasspath,
                   FULL_VERSION,
                   DOT_VERSION,
                   (const_progname != NULL) ? const_progname : *margv,
                   (const_launcher != NULL) ? const_launcher : *margv,
                   (const_jargs != NULL) ? JNI_TRUE : JNI_FALSE,
                   const_cpwildcard, const_javaw, const_ergo_class);
}
~~~
→ JLI_Launch 【src/share/bin/java.c】：
~~~
...
int JLI_Launch(
		int argc, char ** argv,              /* main argc, argc */
        int jargc, const char** jargv,          /* java args */
        int appclassc, const char** appclassv,  /* app classpath */
        const char* fullversion,                /* full version defined */
        const char* dotversion,                 /* dot version defined */
        const char* pname,                      /* program name */
        const char* lname,                      /* launcher name */
        jboolean javaargs,                      /* JAVA_ARGS */
        jboolean cpwildcard,                    /* classpath wildcard*/
        jboolean javaw,                         /* windows-only javaw */
        jint ergo                               /* ergonomics class policy */
)
{
    int mode = LM_UNKNOWN;
    char *what = NULL;
    char *cpath = 0;
    char *main_class = NULL;
    int ret;
    InvocationFunctions ifn;
    jlong start, end;
    char jvmpath[MAXPATHLEN];
    char jrepath[MAXPATHLEN];
    char jvmcfg[MAXPATHLEN];

    _fVersion = fullversion;
    _dVersion = dotversion;
    _launcher_name = lname;
    _program_name = pname;
    _is_java_args = javaargs;
    _wc_enabled = cpwildcard;
    _ergo_policy = ergo;

    InitLauncher(javaw);
    DumpState();

    /*
     * Make sure the specified version of the JRE is running.
     *
     * There are three things to note about the SelectVersion() routine:
     *  1) If the version running isn't correct, this routine doesn't
     *     return (either the correct version has been exec'd or an error
     *     was issued).
     *  2) Argc and Argv in this scope are *not* altered by this routine.
     *     It is the responsibility of subsequent code to ignore the
     *     arguments handled by this routine.
     *  3) As a side-effect, the variable "main_class" is guaranteed to
     *     be set (if it should ever be set).  This isn't exactly the
     *     poster child for structured programming, but it is a small
     *     price to pay for not processing a jar file operand twice.
     *     (Note: This side effect has been disabled.  See comment on
     *     bugid 5030265 below.)
     */
    SelectVersion(argc, argv, &main_class);

    if (JLI_IsTraceLauncher()) {
        int i;
        printf("Command line args:\n");
        for (i = 0; i < argc ; i++) {
            printf("argv[%d] = %s\n", i, argv[i]);
        }
        AddOption("-Dsun.java.launcher.diag=true", NULL);
    }

    CreateExecutionEnvironment(&argc, &argv,
                               jrepath, sizeof(jrepath),
                               jvmpath, sizeof(jvmpath),
                               jvmcfg,  sizeof(jvmcfg));

    ifn.CreateJavaVM = 0;
    ifn.GetDefaultJavaVMInitArgs = 0;

    if (JLI_IsTraceLauncher()) {
        start = CounterGet();
    }

    if (!LoadJavaVM(jvmpath, &ifn)) {
        return(6);
    }

    if (JLI_IsTraceLauncher()) {
        end   = CounterGet();
    }

    JLI_TraceLauncher("%ld micro seconds to LoadJavaVM\n",
             (long)(jint)Counter2Micros(end-start));

    ++argv;
    --argc;

    if (IsJavaArgs()) {
        /* Preprocess wrapper arguments */
        TranslateApplicationArgs(jargc, jargv, &argc, &argv);
        if (!AddApplicationOptions(appclassc, appclassv)) {
            return(1);
        }
    } else {
        /* Set default CLASSPATH */
        cpath = getenv("CLASSPATH");
        if (cpath == NULL) {
            cpath = ".";
        }
        SetClassPath(cpath);
    }

    /* Parse command line options; if the return value of
     * ParseArguments is false, the program should exit.
     */
    if (!ParseArguments(&argc, &argv, &mode, &what, &ret, jrepath))
    {
        return(ret);
    }

    /* Override class path if -jar flag was specified */
    if (mode == LM_JAR) {
        SetClassPath(what);     /* Override class path */
    }

    /* set the -Dsun.java.command pseudo property */
    SetJavaCommandLineProp(what, argc, argv);

    /* Set the -Dsun.java.launcher pseudo property */
    SetJavaLauncherProp();

    /* set the -Dsun.java.launcher.* platform properties */
    SetJavaLauncherPlatformProps();

    return JVMInit(&ifn, threadStackSize, argc, argv, mode, what, ret);
}
~~~


→ LoadJavaVM 【src/solaris/bin/java_md_solinux.c】
~~~
...
jboolean
LoadJavaVM(const char *jvmpath, InvocationFunctions *ifn){
    Dl_info dlinfo;
    void *libjvm;

    JLI_TraceLauncher("JVM path is %s\n", jvmpath);

    libjvm = dlopen(jvmpath, RTLD_NOW + RTLD_GLOBAL);
    if (libjvm == NULL) {
#if defined(__solaris__) && defined(__sparc) && !defined(_LP64) /* i.e. 32-bit sparc */
      FILE * fp;
      Elf32_Ehdr elf_head;
      int count;
      int location;

      fp = fopen(jvmpath, "r");
      if (fp == NULL) {
        JLI_ReportErrorMessage(DLL_ERROR2, jvmpath, dlerror());
        return JNI_FALSE;
      }

      /* read in elf header */
      count = fread((void*)(&elf_head), sizeof(Elf32_Ehdr), 1, fp);
      fclose(fp);
      if (count < 1) {
        JLI_ReportErrorMessage(DLL_ERROR2, jvmpath, dlerror());
        return JNI_FALSE;
      }

      /*
       * Check for running a server vm (compiled with -xarch=v8plus)
       * on a stock v8 processor.  In this case, the machine type in
       * the elf header would not be included the architecture list
       * provided by the isalist command, which is turn is gotten from
       * sysinfo.  This case cannot occur on 64-bit hardware and thus
       * does not have to be checked for in binaries with an LP64 data
       * model.
       */
      if (elf_head.e_machine == EM_SPARC32PLUS) {
        char buf[257];  /* recommended buffer size from sysinfo man
                           page */
        long length;
        char* location;

        length = sysinfo(SI_ISALIST, buf, 257);
        if (length > 0) {
            location = JLI_StrStr(buf, "sparcv8plus ");
          if (location == NULL) {
            JLI_ReportErrorMessage(JVM_ERROR3);
            return JNI_FALSE;
          }
        }
      }
#endif
        JLI_ReportErrorMessage(DLL_ERROR1, __LINE__);
        JLI_ReportErrorMessage(DLL_ERROR2, jvmpath, dlerror());
        return JNI_FALSE;
    }

    ifn->CreateJavaVM = (CreateJavaVM_t)
        dlsym(libjvm, "JNI_CreateJavaVM");
    if (ifn->CreateJavaVM == NULL) {
        JLI_ReportErrorMessage(DLL_ERROR2, jvmpath, dlerror());
        return JNI_FALSE;
    }

    ifn->GetDefaultJavaVMInitArgs = (GetDefaultJavaVMInitArgs_t)
        dlsym(libjvm, "JNI_GetDefaultJavaVMInitArgs");
    if (ifn->GetDefaultJavaVMInitArgs == NULL) {
        JLI_ReportErrorMessage(DLL_ERROR2, jvmpath, dlerror());
        return JNI_FALSE;
    }

    ifn->GetCreatedJavaVMs = (GetCreatedJavaVMs_t)
        dlsym(libjvm, "JNI_GetCreatedJavaVMs");
    if (ifn->GetCreatedJavaVMs == NULL) {
        JLI_ReportErrorMessage(DLL_ERROR2, jvmpath, dlerror());
        return JNI_FALSE;
    }

    return JNI_TRUE;
}
~~~

→ JVMInit 【src/solaris/bin/java_md_solinux.c】：
~~~
...
int JVMInit(InvocationFunctions* ifn, jlong threadStackSize,
        int argc, char **argv,
        int mode, char *what, int ret){
    ShowSplashScreen();
    return ContinueInNewThread(ifn, threadStackSize, argc, argv, mode, what, ret);
}
...
~~~

→ ContinueInNewThread 【src/share/bin/java.c】：
~~~
int ContinueInNewThread(InvocationFunctions* ifn, jlong threadStackSize,
                    int argc, char **argv,
                    int mode, char *what, int ret){

    /*
     * If user doesn't specify stack size, check if VM has a preference.
     * Note that HotSpot no longer supports JNI_VERSION_1_1 but it will
     * return its default stack size through the init args structure.
     */
    if (threadStackSize == 0) {
      struct JDK1_1InitArgs args1_1;
      memset((void*)&args1_1, 0, sizeof(args1_1));
      args1_1.version = JNI_VERSION_1_1;
      ifn->GetDefaultJavaVMInitArgs(&args1_1);  /* ignore return value */
      if (args1_1.javaStackSize > 0) {
         threadStackSize = args1_1.javaStackSize;
      }
    }

    { /* Create a new thread to create JVM and invoke main method */
      JavaMainArgs args;
      int rslt;

      args.argc = argc;
      args.argv = argv;
      args.mode = mode;
      args.what = what;
      args.ifn = *ifn;

      rslt = ContinueInNewThread0(JavaMain, threadStackSize, (void*)&args);
      /* If the caller has deemed there is an error we
       * simply return that, otherwise we return the value of
       * the callee
       */
      return (ret != 0) ? ret : rslt;
    }
}
~~~

→ ContinueInNewThread0 【src/solaris/bin/java_md_solinux.c】：
~~~
/*
 * Block current thread and continue execution in a new thread
 */
int
ContinueInNewThread0(int (JNICALL *continuation)(void *), jlong stack_size, void * args) {
    int rslt;
#ifdef __linux__
    pthread_t tid;
    pthread_attr_t attr;
    pthread_attr_init(&attr);
    pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_JOINABLE);

    if (stack_size > 0) {
      pthread_attr_setstacksize(&attr, stack_size);
    }

    if (pthread_create(&tid, &attr, (void *(*)(void*))continuation, (void*)args) == 0) {
      void * tmp;
      pthread_join(tid, &tmp);
      rslt = (int)tmp;
    } else {
     /*
      * Continue execution in current thread if for some reason (e.g. out of
      * memory/LWP)  a new thread can't be created. This will likely fail
      * later in continuation as JNI_CreateJavaVM needs to create quite a
      * few new threads, anyway, just give it a try..
      */
      rslt = continuation(args);
    }

    pthread_attr_destroy(&attr);
#else /* ! __linux__ */
    thread_t tid;
    long flags = 0;
    if (thr_create(NULL, stack_size, (void *(*)(void *))continuation, args, flags, &tid) == 0) {
      void * tmp;
      thr_join(tid, NULL, &tmp);
      rslt = (int)tmp;
    } else {
      /* See above. Continue in current thread if thr_create() failed */
      rslt = continuation(args);
    }
#endif /* __linux__ */
    return rslt;
}
~~~

→ ContinueInNewThread0 【src/solaris/bin/java_md_solinux.c】：
~~~
int JNICALL JavaMain(void * _args){

    JavaMainArgs *args = (JavaMainArgs *)_args;
    int argc = args->argc;
    char **argv = args->argv;
    int mode = args->mode;
    char *what = args->what;
    InvocationFunctions ifn = args->ifn;

    JavaVM *vm = 0;
    JNIEnv *env = 0;
    jclass mainClass = NULL;
    jmethodID mainID;
    jobjectArray mainArgs;
    int ret = 0;
    jlong start, end;

    RegisterThread();

    /* Initialize the virtual machine */
    start = CounterGet();
    if (!InitializeJVM(&vm, &env, &ifn)) {
        JLI_ReportErrorMessage(JVM_ERROR1);
        exit(1);
    }

    if (showSettings != NULL) {
        ShowSettings(env, showSettings);
        CHECK_EXCEPTION_LEAVE(1);
    }

    if (printVersion || showVersion) {
        PrintJavaVersion(env, showVersion);
        CHECK_EXCEPTION_LEAVE(0);
        if (printVersion) {
            LEAVE();
        }
    }

    /* If the user specified neither a class name nor a JAR file */
    if (printXUsage || printUsage || what == 0 || mode == LM_UNKNOWN) {
        PrintUsage(env, printXUsage);
        CHECK_EXCEPTION_LEAVE(1);
        LEAVE();
    }

    FreeKnownVMs();  /* after last possible PrintUsage() */

    if (JLI_IsTraceLauncher()) {
        end = CounterGet();
        JLI_TraceLauncher("%ld micro seconds to InitializeJVM\n",
               (long)(jint)Counter2Micros(end-start));
    }

    /* At this stage, argc/argv have the application's arguments */
    if (JLI_IsTraceLauncher()){
        int i;
        printf("%s is '%s'\n", launchModeNames[mode], what);
        printf("App's argc is %d\n", argc);
        for (i=0; i < argc; i++) {
            printf("    argv[%2d] = '%s'\n", i, argv[i]);
        }
    }

    ret = 1;

    /*
     * Get the application's main class.
     *
     * See bugid 5030265.  The Main-Class name has already been parsed
     * from the manifest, but not parsed properly for UTF-8 support.
     * Hence the code here ignores the value previously extracted and
     * uses the pre-existing code to reextract the value.  This is
     * possibly an end of release cycle expedient.  However, it has
     * also been discovered that passing some character sets through
     * the environment has "strange" behavior on some variants of
     * Windows.  Hence, maybe the manifest parsing code local to the
     * launcher should never be enhanced.
     *
     * Hence, future work should either:
     *     1)   Correct the local parsing code and verify that the
     *          Main-Class attribute gets properly passed through
     *          all environments,
     *     2)   Remove the vestages of maintaining main_class through
     *          the environment (and remove these comments).
     */
    mainClass = LoadMainClass(env, mode, what);
    CHECK_EXCEPTION_NULL_LEAVE(mainClass);
    PostJVMInit(env, mainClass, vm);
    /*
     * The LoadMainClass not only loads the main class, it will also ensure
     * that the main method's signature is correct, therefore further checking
     * is not required. The main method is invoked here so that extraneous java
     * stacks are not in the application stack trace.
     */
    mainID = (*env)->GetStaticMethodID(env, mainClass, "main",
                                       "([Ljava/lang/String;)V");
    CHECK_EXCEPTION_NULL_LEAVE(mainID);

    /* Build argument array */
    mainArgs = NewPlatformStringArray(env, argv, argc);
    CHECK_EXCEPTION_NULL_LEAVE(mainArgs);

    /* Invoke main method. */
    (*env)->CallStaticVoidMethod(env, mainClass, mainID, mainArgs);

    /*
     * The launcher's exit code (in the absence of calls to
     * System.exit) will be non-zero if main threw an exception.
     */
    ret = (*env)->ExceptionOccurred(env) == NULL ? 0 : 1;
    LEAVE();
}
~~~

→ InitializeJVM 【src/share/bin/java.c】
~~~
/*
 * Initializes the Java Virtual Machine. Also frees options array when
 * finished.
 */
static jboolean InitializeJVM(
	JavaVM **pvm,
	JNIEnv **penv,
	InvocationFunctions *ifn
){

    JavaVMInitArgs args;
    jint r;

    memset(&args, 0, sizeof(args));
    args.version  = JNI_VERSION_1_2;
    args.nOptions = numOptions;
    args.options  = options;
    args.ignoreUnrecognized = JNI_FALSE;

    if (JLI_IsTraceLauncher()) {
        int i = 0;
        printf("JavaVM args:\n    ");
        printf("version 0x%08lx, ", (long)args.version);
        printf("ignoreUnrecognized is %s, ",
               args.ignoreUnrecognized ? "JNI_TRUE" : "JNI_FALSE");
        printf("nOptions is %ld\n", (long)args.nOptions);
        for (i = 0; i < numOptions; i++)
            printf("    option[%2d] = '%s'\n",
                   i, args.options[i].optionString);
    }

    r = ifn->CreateJavaVM(pvm, (void **)penv, &args);
    JLI_MemFree(options);
    return r == JNI_OK;
}
~~~

**（以上，仅代表个人观点。无论对错，欢迎交流。^_^ ）**

[JavaArchitecture]: {{ "/2017-07-13-javaArchitecture.png" | prepend: site.imgrepo }}
[JVM]: {{ "/2017-07-13-jvm.png" | prepend: site.imgrepo }}
[JVMCode]: {{ "/2017-07-13-2jvmCode.png" | prepend: site.imgrepo }}
[JVMRunEngine]: {{ "/2017-07-13-jvmRunEngine.png" | prepend: site.imgrepo }}
[classLoader]: {{ "/2017-07-13-classLoader.png" | prepend: site.imgrepo }}
[JVMMemory]: {{ "/2017-07-13-jvmMemory.png" | prepend:site.imgrepo }}
