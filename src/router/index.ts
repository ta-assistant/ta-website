import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import SignIn from "../views/SignIn.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    meta: {
      breadcrumb: "Home",
    },
    component: Home,
  },
  {
    path: "/signIn",
    name: "SignIn",
    meta: {
      breadcrumb: "Sign In",
    },
    component: SignIn,
  },
  {
    path: "/course",
    name: "course",
    meta: {
      breadcrumb: "Course",
    },
    component: () =>
      import(/* webpackChunkName: "course" */ "@/views/course.vue"),
    children: [
      {
        path: ":courseId",
        name: "course_detail",
        meta: {
          breadcrumb: "Course Detail",
        },
        component: () =>
          import(/* webpackChunkName: "course" */ "@/views/course/detail.vue"),
        children: [
          {
            path: "work/:workId",
            name: "WorkSubmission",
            meta: {
              breadcrumb: "Work Submission",
            },
            component: () =>
              import(
                /* webpackChunkName: "work" */ "@/views/course/submission.vue"
              ),
            children: [
              {
                path: "/course/:courseId/work/:workId/submission/:submissionId",
                name: "exercise",
                meta: {
                  breadcrumb: "Submission Detail",
                },
                component: () =>
                  import(
                    /* webpackChunkName: "work" */ "@/views/course/work.vue"
                  ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    meta: {
      breadcrumb: "About",
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    meta: {
      breadcrumb: "Settings",
    },
    component: () =>
      import(/* webpackChunkName: "setting" */ "../views/settings.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
