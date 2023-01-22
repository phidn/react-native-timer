const veryIntensiveTask = async (taskDataArguments) => {
  const { delay } = taskDataArguments
  await new Promise(async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log(i)
      await sleep(delay)
    }
  })
}

export const startMeditateBackgroundAction = async () => {
  const options = {
    taskName: 'Example',
    taskTitle: t('app.name'),
    taskDesc: t('notifee.returnToApp'),
    taskIcon: {
      name: 'ic_small_icon',
      type: 'drawable',
    },
    color: colors.primary,
    linkingURI: 'yourSchemeHere://chat/jane',
    parameters: {
      delay: 1000,
    },
  }

  await BackgroundService.start(veryIntensiveTask, options)
}
