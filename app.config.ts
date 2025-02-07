export default defineAppConfig({
  modules: [
    {
      id: "temporary-voice",
      icon: "lucide:mic-vocal",
      items: [
        {
          id: "settings",
          to: {
            name: "temporary-voice-settings",
          },
        },
      ],
    },
  ],
});
