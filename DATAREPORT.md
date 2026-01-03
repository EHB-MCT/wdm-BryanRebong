# Pitfalls, Shortcomings, and What I have learned

Although the system collects a large amount of interaction data, the dataset remains limited in diversity. Most of the stored information is based on click actions and navigation events, which led to repetitive and relatively simple visualizations.

A major shortcoming is that the system does not store unique voice-related data, despite relying on voice input for its core functionality. While microphone input is used to calculate singing scores, raw or descriptive voice data is not persisted. This prevents deeper analysis of vocal patterns and results in charts that fail to reflect one of the project’s most distinctive features.

Because of this limitation, the majority of visualizations are built on similar behavioral metrics, such as selections, attempts, and interactions. As a result, different charts often represent variations of the same underlying data, reducing analytical value.

Another shortcoming is the lack of differentiation between intentional and unintentional user behavior. The system records all interactions—such as clicks, retries, and navigation—as equally meaningful, without accounting for hesitation, misclicks, or technical errors. This causes noisy or accidental actions to be stored as deliberate signals, which can distort inferred preferences and engagement patterns. As a result, user profiles may exaggerate interest or difficulty where none actually exists.

Finally, contextual data such as the user’s singing location is not collected. Location-based data could have enabled more varied visualizations and revealed environmental influences on performance, but due to its absence, this was not the case.

Through this project, I learned that unique system features only become meaningful when their data is intentionally captured and stored. Without translating complex inputs into structured data, analysis becomes shallow, and visualization risks oversimplifying the user experience.
