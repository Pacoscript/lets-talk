import React from 'react'

function Landing() {
  return (
    <main className="landing">
      <section>
        <h1 className="landing__subtitle">SLOW LOVE...</h1>
      </section>

      <section className="landing__instructions">
        <div className="landing__message">
          <p>
            This app is for the people who like to take their life calmly. For
            people who prefer talking to get to know one another.
          </p>
          <p>
            For these reason, whe have some simple rules. You have 280
            charachters to send a message to who you want. But you will have to
            wait to be responded to send another message. So choose well your
            words.
          </p>
          <p>
            We know you want to see the aspects of the other one. But let's not
            be impatient. You will see the first photo of eachother after 4
            messages. The second after 8 messages and the last one after 12
            messages. If you arrive there, congratulations, you have connected
            with someone!!
          </p>
        </div>
      </section>
    </main>
  )
}

export default Landing
