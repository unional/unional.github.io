(window.webpackJsonp=window.webpackJsonp||[]).push([[22],{94:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return r})),n.d(t,"metadata",(function(){return c})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return s}));var a=n(3),o=n(7),i=(n(0),n(104)),r={slug:"what-is-fp",title:"What is Functional Programming",author:"Unional",author_title:"Clean Architect",author_url:"https://github.com/unional",author_image_url:"https://avatars0.githubusercontent.com/unional?s=400&v=4",tags:["functional programming","just-func"]},c={permalink:"/blog/what-is-fp",editUrl:"https://github.com/unional/unional.github.io/edit/master/blog/blog/2021-03-21-what-is-functional-programming.md",source:"@site/blog/2021-03-21-what-is-functional-programming.md",description:"I have been promoting and migrating from Object Oriented Programming to Functional Programing for many years, and I loved it.",date:"2021-03-21T00:00:00.000Z",formattedDate:"March 21, 2021",tags:[{label:"functional programming",permalink:"/blog/tags/functional-programming"},{label:"just-func",permalink:"/blog/tags/just-func"}],title:"What is Functional Programming",readingTime:3.635,truncated:!1},l=[{value:"Functional Programming Paradigm",id:"functional-programming-paradigm",children:[]},{value:"References",id:"references",children:[]}],b={toc:l};function s(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(a.a)({},b,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"I have been promoting and migrating from Object Oriented Programming to Functional Programing for many years, and I loved it."),Object(i.b)("p",null,"But just like everything,\nthe more you dig into it, the more you realize what you do not know."),Object(i.b)("p",null,"Recently I have been working on ",Object(i.b)("a",{parentName:"p",href:"https://github.com/justland/just-func"},Object(i.b)("inlineCode",{parentName:"a"},"just-func")),"."),Object(i.b)("p",null,"I want to design it to be a homoiconic, functional programming language."),Object(i.b)("p",null,"But when I put my finger to it,\nI start wondering what exactly is functional programming."),Object(i.b)("p",null,"When people talk about functional programming,\nthey often talk about languages such as Lisp, Haskell, F#, Clojure, etc."),Object(i.b)("p",null,"But can you do functional programming in other languages?"),Object(i.b)("p",null,"Of course! You can do it in JavaScript/TypeScript,\nand you can do it in C#, Java, and even C++."),Object(i.b)("p",null,"They also talk about recursion, immutability, monoid, monad, functor, etc."),Object(i.b)("p",null,"So do they define functional programming?"),Object(i.b)("p",null,"In order to design ",Object(i.b)("a",{parentName:"p",href:"https://github.com/justland/just-func"},Object(i.b)("inlineCode",{parentName:"a"},"just-func"))," correctly,\nI send myself on a small research journey."),Object(i.b)("h2",{id:"functional-programming-paradigm"},"Functional Programming Paradigm"),Object(i.b)("p",null,"Functional Programming (FP) is a paradigm,\njust like Object Oriented Programming (OOP) is a paradigm."),Object(i.b)("p",null,"FP has its root in lambda calculus, which is a subset of category theory."),Object(i.b)("p",null,"Therefore, to understand FP, we should first understand category theory."),Object(i.b)("p",null,"There is a lot to learn about FP from category theory.\nBut in this blog, we only need to answer the very first question: what is a category?"),Object(i.b)("p",null,"Bartosz Milewski's excellent book ",Object(i.b)("a",{parentName:"p",href:"https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/"},"Category Theory for Programmers")," has the perfect description:"),Object(i.b)("blockquote",null,Object(i.b)("p",{parentName:"blockquote"},"A category consists of objects and arrows that go between them.")),Object(i.b)("p",null,"From this definition, a category has two things: objects and arrows."),Object(i.b)("p",null,"What is an object? The definition didn't specify. It is intentional thou.\nFor now, let's keep it that way."),Object(i.b)("p",null,"What is an arrow? The definition also didn't specify. But it does give a bit more information about it: arrows that go between them."),Object(i.b)("p",null,'Arrow is directional, and "go between them" means the arrow starts form one object and ends with one object.'),Object(i.b)("p",null,"The start object and the end object can be the same object, or they can be different."),Object(i.b)("p",null,"One last thing is notice that they are plural: objects and arrows.\nIn mathematics, that means they are a set: a set of objects and a set of arrows."),Object(i.b)("p",null,"So putting these back together, the definition becomes:"),Object(i.b)("blockquote",null,Object(i.b)("p",{parentName:"blockquote"},"A category is about ",Object(i.b)("em",{parentName:"p"},"a set of objects ",Object(i.b)("inlineCode",{parentName:"em"},"a"))," to ",Object(i.b)("em",{parentName:"p"},"a set of objects ",Object(i.b)("inlineCode",{parentName:"em"},"b")),", and ",Object(i.b)("em",{parentName:"p"},"a set of transformations ",Object(i.b)("inlineCode",{parentName:"em"},"f"))," that transforms ",Object(i.b)("inlineCode",{parentName:"p"},"a")," to ",Object(i.b)("inlineCode",{parentName:"p"},"b"),".")),Object(i.b)("p",null,"i.e.: ",Object(i.b)("inlineCode",{parentName:"p"},"f(a) -> b")),Object(i.b)("p",null,"It is a function!"),Object(i.b)("p",null,"Note that ",Object(i.b)("inlineCode",{parentName:"p"},"f"),", ",Object(i.b)("inlineCode",{parentName:"p"},"a"),", and ",Object(i.b)("inlineCode",{parentName:"p"},"b")," all have their significances."),Object(i.b)("p",null,"This mean when talking about a specific category,\nwe need to specify ",Object(i.b)("inlineCode",{parentName:"p"},"f"),", ",Object(i.b)("inlineCode",{parentName:"p"},"a"),", and ",Object(i.b)("inlineCode",{parentName:"p"},"b"),"."),Object(i.b)("p",null,"From here, we can derive the two basic ",Object(i.b)("em",{parentName:"p"},"requirements")," of FP:"),Object(i.b)("ol",null,Object(i.b)("li",{parentName:"ol"},"Since we are talking about mathematics, this function ",Object(i.b)("inlineCode",{parentName:"li"},"f(a) -> b")," must be pure."),Object(i.b)("li",{parentName:"ol"},Object(i.b)("inlineCode",{parentName:"li"},"a")," and ",Object(i.b)("inlineCode",{parentName:"li"},"b")," are just ",Object(i.b)("em",{parentName:"li"},"set of objects"),", this means they can be anything:\\\nvalues (such as strings and numbers), set of values (such as arrays, lists, vectors, objects),\\\nfunctions (higher-order functions), or set of functions (generics)")),Object(i.b)("p",null,"Any other characteristics of FP are just derivatives of these two requirements.\nLet list a few here:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"immutable data: this is needed for the function to be pure"),Object(i.b)("li",{parentName:"ul"},"first-class function: this preferred (but not required) so that we can use ",Object(i.b)("em",{parentName:"li"},"a set of functions")," for ",Object(i.b)("inlineCode",{parentName:"li"},"a")," or ",Object(i.b)("inlineCode",{parentName:"li"},"b")),Object(i.b)("li",{parentName:"ul"},"closure: this is beneficial (but not required) as it allows function to capture additional context"),Object(i.b)("li",{parentName:"ul"},"declarative programming: this is the result of no needed to mutate data."),Object(i.b)("li",{parentName:"ul"},"recursion instead of looping: this is the result of not able to mutate data")),Object(i.b)("p",null,'Notice that in "we can derive the two basic ',Object(i.b)("em",{parentName:"p"},"requirements"),' of FP" I made the word ',Object(i.b)("em",{parentName:"p"},"requirements"),' italic,\nand I also mentioned that "first-class function* is preferred but not required.'),Object(i.b)("p",null,"It is because we can always wrap a function in an object and pass it along.\nIt is very clumsy but is doable.\nThat is how you write functional code in OOP languages such as Java and C#."),Object(i.b)("p",null,"Therefore, the ONLY requirement of FP is pure function."),Object(i.b)("p",null,"That means you can write functional programing any programming language."),Object(i.b)("p",null,"Of course, just that requirement is not that useful.\nThere are still a lot more to talk about."),Object(i.b)("p",null,"Until then, Happy coding!"),Object(i.b)("h2",{id:"references"},"References"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",{parentName:"li",href:"https://cleancoders.com/series/humane-code-real"},"Clean Coders Humane Code Series")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",{parentName:"li",href:"https://cleancoders.com/series/clean-code/functional-programming"},"Clean Coders Functional Programming Series")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",{parentName:"li",href:"https://bartoszmilewski.com/2014/10/28/category-theory-for-programmers-the-preface/"},"Category Theory For Programmers")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",{parentName:"li",href:"https://www.tutorialspoint.com/functional_programming/functional_programming_introduction.htm"},"https://www.tutorialspoint.com/functional_programming/functional_programming_introduction.htm")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",{parentName:"li",href:"https://en.wikipedia.org/wiki/Functional_programming"},"https://en.wikipedia.org/wiki/Functional_programming")),Object(i.b)("li",{parentName:"ul"},Object(i.b)("a",{parentName:"li",href:"https://www.guru99.com/functional-programming-tutorial.html"},"https://www.guru99.com/functional-programming-tutorial.html"))))}s.isMDXComponent=!0}}]);